import { RENDER_URL } from "@/app/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    const res = await fetch(RENDER_URL + `/disconnect`, {
      method: "POST",
      body: JSON.stringify({ sessionId }),
      headers: {
        "x-api-key": process.env.RENDER_API_KEY!,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error from Eliza:", errorText);
      throw new Error("Failed to call Eliza disconnect");
    }

    let data = await res.json();

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
