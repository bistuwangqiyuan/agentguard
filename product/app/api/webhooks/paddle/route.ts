import { NextResponse } from "next/server";
import { handlePaddleWebhook, verifyPaddleSignature } from "@/lib/paddle";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature");

  if (!process.env.PADDLE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  if (!verifyPaddleSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const result = await handlePaddleWebhook(rawBody);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("paddle webhook error", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
