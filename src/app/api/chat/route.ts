import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import guardRequest from "@/app/lib/helpers/guardRequest";
import { hiloAgotado, verificarHilo } from "@/app/lib/helpers/firmarHilo";
import {
  CHAT_INSTRUCTIONS,
  CHAT_MODEL,
  CHAT_TIMEOUT_MS,
  CHAT_TOOL_NAME,
  MAX_CHAT_BODY_BYTES,
  MAX_OUTPUT_TOKENS,
  MAX_PROMPT_LENGTH,
  MAX_SEARCH_LENGTH,
  MAX_SEARCH_RESULTS,
  MAX_SEARCH_TERMS,
  MAX_TOOL_CALLS_PER_ROUND,
  MAX_TOOL_ROUNDS,
  RATE_LIMIT_CHAT,
} from "@/app/lib/constants";
import { ChatRun } from "@/app/components/Chat/types/chat.types";
import { getWorkflows } from "../../../../graphql/queries/getWorkflows";

export const maxDuration = 60;

const tools: OpenAI.Responses.FunctionTool[] = [
  {
    type: "function",
    name: CHAT_TOOL_NAME,
    description:
      "Search the Lucidity catalogue of ComfyUI and ComfyStream workflows by keywords. Returns the names of the matching workflows.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description:
            "Space separated keywords matched against workflow names, descriptions, tags and workflow JSON.",
        },
      },
      required: ["search"],
      additionalProperties: false,
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const blocked = guardRequest(req, "chat", RATE_LIMIT_CHAT);
    if (blocked) return blocked;

    if (!process.env.OPENAI_API_KEY) {
      console.error("Chat is not configured");
      return NextResponse.json({ error: "Chat failed" }, { status: 500 });
    }

    const lengthHeader = req.headers.get("content-length");
    if (
      lengthHeader &&
      (!/^\d+$/.test(lengthHeader.trim()) ||
        Number(lengthHeader) > MAX_CHAT_BODY_BYTES)
    ) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const texto = await req.text();
    if (texto.length > MAX_CHAT_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let body: any;
    try {
      body = JSON.parse(texto);
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: "Prompt is too long" }, { status: 413 });
    }

    const conversation = verificarHilo(body?.thread);
    if (!conversation) {
      return NextResponse.json(
        { error: "Invalid thread", expired: true },
        { status: 403 }
      );
    }

    if (hiloAgotado(conversation)) {
      return NextResponse.json(
        { error: "Thread is full", expired: true },
        { status: 409 }
      );
    }

    const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await handleRun(openAI, conversation, prompt);

    if (!res) {
      return NextResponse.json(
        { error: "Chat failed", expired: true },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, run: res });
  } catch (error: any) {
    console.error(error?.message);
    return NextResponse.json(
      { error: "Chat failed", expired: true },
      { status: 500 }
    );
  }
}

const handleRun = async (
  openAI: OpenAI,
  conversation: string,
  prompt: string
): Promise<ChatRun | undefined> => {
  const deadline = Date.now() + CHAT_TIMEOUT_MS;
  const tool_output: ChatRun["output"] = [];
  let input: OpenAI.Responses.ResponseInput = [
    { role: "user", content: prompt },
  ];

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      console.error("Chat run timed out");
      return;
    }

    const response = await openAI.responses.create(
      {
        model: process.env.OPENAI_MODEL || CHAT_MODEL,
        instructions: process.env.OPENAI_INSTRUCTIONS || CHAT_INSTRUCTIONS,
        conversation,
        input,
        tools,
        tool_choice: round === MAX_TOOL_ROUNDS ? "none" : "auto",
        max_output_tokens: MAX_OUTPUT_TOKENS,
      },
      { timeout: remaining, maxRetries: 0 }
    );

    if (response.status !== "completed") {
      console.error(
        "Chat run ended with status",
        response.status,
        response.error?.code,
        response.incomplete_details?.reason
      );
      return;
    }

    const calls = response.output.filter(
      (item): item is OpenAI.Responses.ResponseFunctionToolCall =>
        item.type === "function_call"
    );

    if (calls.length === 0) {
      return {
        message: response.output_text ?? "",
        output: tool_output,
      };
    }

    input = [];
    for (let index = 0; index < calls.length; index++) {
      const call = calls[index];
      let output = JSON.stringify({ error: "Search failed" });

      if (index >= MAX_TOOL_CALLS_PER_ROUND) {
        output = JSON.stringify({ error: "Too many searches" });
      } else if (call.name !== CHAT_TOOL_NAME) {
        console.error("Function not found");
        output = JSON.stringify({ error: "Unknown function" });
      } else {
        try {
          const found = await getWorkflowsTool(
            JSON.parse(call.arguments),
            deadline - Date.now()
          );
          output = JSON.stringify(
            found.map((item: any) =>
              String(item?.workflowMetadata?.name ?? "").slice(0, 200)
            )
          );
          tool_output.push({
            name: "GET_WORKFLOWS",
            output: JSON.stringify(found),
          });
        } catch (error: any) {
          console.error("Error executing function", error?.message);
        }
      }

      input.push({
        type: "function_call_output",
        call_id: call.call_id,
        output,
      });
    }
  }

  return;
};

const getWorkflowsTool = async (
  params: { search?: unknown },
  remaining: number
): Promise<any[]> => {
  if (remaining <= 0) {
    throw new Error("Search timed out");
  }

  const searchTerms = String(
    typeof params?.search === "string" ? params.search : ""
  )
    .slice(0, MAX_SEARCH_LENGTH)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_SEARCH_TERMS);

  if (searchTerms.length === 0) return [];

  const orConditions = searchTerms.flatMap((term) => [
    { description_contains_nocase: term },
    { name_contains_nocase: term },
    { tags_contains_nocase: term },
    { workflow_contains_nocase: term },
  ]);

  let timeoutId: NodeJS.Timeout | undefined;
  const timeout = new Promise<undefined>((resolve) => {
    timeoutId = setTimeout(() => resolve(undefined), remaining);
  });

  const result: any = await Promise.race([
    getWorkflows({
      workflowMetadata_: {
        or: orConditions,
      },
    }),
    timeout,
  ]);

  timeoutId && clearTimeout(timeoutId);

  const found = result?.data?.workflowCreateds;
  if (!Array.isArray(found)) {
    throw new Error("Search failed");
  }

  return found.slice(0, MAX_SEARCH_RESULTS);
};
