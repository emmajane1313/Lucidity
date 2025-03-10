import { RENDER_URL } from "@/app/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // const { searchParams } = new URL(req.url);
    // const sessionId = searchParams.get("sessionId");

    // if (!sessionId) {
    //   return NextResponse.json(
    //     { error: "⛔ Falta el sessionId" },
    //     { status: 400 }
    //   );
    // }

    const formData = await req.formData();

    const forwardData = new FormData();
    formData.forEach((value, key) => {
      forwardData.append(key, value);
    });

    const res = await fetch(
      // `${RENDER_URL}/chat/${sessionId}`,
      `${RENDER_URL}/e51f224d-70d3-0f8c-90d5-e456b6ab9822/message`,
      {
        method: "POST",
        body: forwardData,
        headers: {
          "x-api-key": process.env.RENDER_API_KEY!,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error from Eliza:", errorText);
      throw new Error("Failed to call Eliza");
    }


    let data = await res.json();
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
