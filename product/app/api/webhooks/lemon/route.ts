import { NextResponse } from "next/server";
import { handleLemonWebhook, verifyLemonSignature } from "@/lib/lemon";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 }
    );
  }

  if (!verifyLemonSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const result = await handleLemonWebhook(rawBody);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("lemon webhook error", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
