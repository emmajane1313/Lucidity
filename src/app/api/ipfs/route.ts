import { NextResponse } from "next/server";
import guardRequest from "@/app/lib/helpers/guardRequest";
import { MAX_UPLOAD_BYTES, RATE_LIMIT_IPFS } from "@/app/lib/constants";

const auth = "Bearer " + process.env.IPFS_ADD_KEY;

const readBody = async (req: Request): Promise<Uint8Array | undefined> => {
  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array(0);

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > MAX_UPLOAD_BYTES) {
        await reader.cancel();
        return undefined;
      }
      chunks.push(value);
    }
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  });

  return merged;
};

export async function POST(req: Request) {
  try {
    const blocked = guardRequest(req, "ipfs", RATE_LIMIT_IPFS);
    if (blocked) return blocked;

    const lengthHeader = req.headers.get("content-length");
    if (
      lengthHeader &&
      (!/^\d+$/.test(lengthHeader.trim()) ||
        Number(lengthHeader) > MAX_UPLOAD_BYTES)
    ) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const bytes = await readBody(req);
    if (!bytes) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: "Empty payload" }, { status: 400 });
    }

    const contentType = req.headers.get("content-type") || "";
    const body = new FormData();

    if (contentType.includes("application/json")) {
      const blob = new Blob(
        [JSON.stringify(JSON.parse(new TextDecoder().decode(bytes)))],
        {
          type: "application/json",
        }
      );

      body.append("file", blob, "file.json");
    } else {
      if (!contentType.toLowerCase().startsWith("image/")) {
        return NextResponse.json(
          { error: "Unsupported content type" },
          { status: 415 }
        );
      }

      body.append(
        "file",
        new Blob([bytes as BlobPart], { type: contentType }),
        "file.png"
      );
    }
    const response = await fetch("https://cdn.digitalax.xyz/api/v0/add", {
      method: "POST",
      headers: {
        authorization: auth,
      },
      body,
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from IPFS:", errorText);
      throw new Error("Failed to upload to IPFS");
    }
    const data = await response.json();
    const cid = data?.Hash;

    return NextResponse.json({ cid });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json(
      { error: "Failed to upload to IPFS" },
      { status: 500 }
    );
  }
}
