import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import guardRequest from "@/app/lib/helpers/guardRequest";
import { firmarHilo } from "@/app/lib/helpers/firmarHilo";
import { RATE_LIMIT_THREAD } from "@/app/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const blocked = guardRequest(req, "thread", RATE_LIMIT_THREAD);
    if (blocked) return blocked;

    if (!process.env.OPENAI_API_KEY) {
      console.error("Chat is not configured");
      return NextResponse.json({ error: "Chat failed" }, { status: 500 });
    }

    const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const conversation = await openAI.conversations.create(
      {},
      { timeout: 20000, maxRetries: 1 }
    );

    const threadId = firmarHilo(conversation.id);
    if (!threadId) {
      console.error("Thread could not be signed");
      return NextResponse.json({ error: "Chat failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, threadId });
  } catch (error: any) {
    console.error(error?.message);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
