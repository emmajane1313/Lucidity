import { ASSISTANT_ID } from "@/app/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getWorkflows } from "../../../../graphql/queries/getWorkflows";

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, thread } = await req.json();
    await openAI.beta.threads.messages.create(thread, {
      role: "user",
      content: prompt,
    });

    let run = await openAI.beta.threads.runs.createAndPoll(thread, {
      assistant_id: ASSISTANT_ID,
    });

    const res = await handleRun(run);
    // const runSteps = await openAI.beta.threads.runs.steps.list(
    //   thread,
    //   run.id
    // );


    return NextResponse.json({ success: true, run: res });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const handleRun = async (
  run: OpenAI.Beta.Threads.Runs.Run
): Promise<
  | {
      messages: OpenAI.Beta.Threads.Messages.Message[];
      output: {
        name: string;
        output: string;
      }[];
    }
  | undefined
> => {
  let tool_output: {
    name: string;
    output: string;
  }[] = [];
  while (true) {
    const runRetrieved = await openAI.beta.threads.runs.retrieve(
      run.thread_id,
      run.id
    );
    let status = runRetrieved.status;

    if (status === "requires_action") {
      const requiredActions =
        runRetrieved?.required_action?.submit_tool_outputs.tool_calls;

      if (requiredActions) {
        let toolsOutput: {
          tool_call_id: string;
          output: string;
        }[] = [];
        for (const action of requiredActions) {
          const funcName = action.function.name;
          const functionArguments = JSON.parse(action.function.arguments);

          if (funcName === "getWorkflowsTool") {
            try {
              const output = await getWorkflowsTool(functionArguments);
              toolsOutput.push({
                tool_call_id: action.id,
                output: JSON.stringify(
                  JSON.parse(output).map(
                    (item: any) => item?.workflowMetadata?.name
                  )
                ),
              });
              tool_output.push({
                name: "GET_WORKFLOWS",
                output: output,
              });
            } catch (error) {
              console.error(`Error executing function ${funcName}: ${error}`);
            }
          } else {
            console.error("Function not found");
            break;
          }
        }

        if (toolsOutput.length > 0) {
          await openAI.beta.threads.runs.submitToolOutputs(
            run.thread_id,
            run.id,
            {
              tool_outputs: toolsOutput,
            }
          );
        }
      }
    } else if (status === "completed") {
      let messages = await openAI.beta.threads.messages.list(run.thread_id);
      return {
        messages: messages.data,
        output: tool_output,
      };
    } else if (status === "failed" || status === "cancelled") {
      console.error("Run failed or was cancelled.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

const getWorkflowsTool = async (params: { search: string }) => {
  try {
    const searchTerms = params?.search.split(" ").filter(Boolean);
    const orConditions = searchTerms.flatMap((term) => [
      { description_contains_nocase: term },
      { name_contains_nocase: term },
      { tags_contains_nocase: term },
      { workflow_contains_nocase: term },
    ]);

    const result = await getWorkflows({
      workflowMetadata_: {
        or: orConditions,
      },
    });

    return JSON.stringify(result?.data?.workflowCreateds, null, 2);
  } catch (error) {
    console.error("API Error:", error);

    throw error;
  }
};
