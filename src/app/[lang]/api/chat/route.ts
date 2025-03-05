import { RENDER_URL } from "@/app/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const forwardData = new FormData();
    formData.forEach((value, key) => {
      forwardData.append(key, value);
    });

    const res = await fetch(RENDER_URL, {
      method: "POST",
      body: forwardData,
      
    });



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
