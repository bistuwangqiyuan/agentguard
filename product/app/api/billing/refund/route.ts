import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createRefundRequest } from "@/lib/store";
import { sendOpsEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let email = "";
  let reason = "";
  try {
    const body = (await req.json()) as { email?: string; reason?: string };
    email = (body.email || "").trim().toLowerCase();
    reason = (body.reason || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!email.includes("@") || reason.length < 8) {
    return NextResponse.json(
      { error: "Valid email and reason (8+ chars) required" },
      { status: 400 }
    );
  }
  const user = await getSessionUser();
  const id = await createRefundRequest({
    userId: user?.id,
    email: user?.email || email,
    reason,
  });
  await sendOpsEmail(
    "Refund request",
    `id=${id}\nemail=${user?.email || email}\nreason=${reason}\n\nAction: refund in Paddle Dashboard (instant refund policy).`
  );
  return NextResponse.json({
    ok: true,
    id,
    note: "Request logged. We process refunds in Paddle as Merchant of Record — typically same day.",
  });
}
