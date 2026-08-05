import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/store";
import { sendOpsEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let email = "";
  let subject = "";
  let body = "";
  try {
    const data = (await req.json()) as { email?: string; subject?: string; body?: string };
    email = (data.email || "").trim().toLowerCase();
    subject = (data.subject || "").trim();
    body = (data.body || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!email.includes("@") || subject.length < 3 || body.length < 10) {
    return NextResponse.json({ error: "Email, subject, and message required" }, { status: 400 });
  }
  const id = await createContactMessage({ email, subject, body });
  await sendOpsEmail(`Contact: ${subject}`, `id=${id}\nfrom=${email}\n\n${body}`);
  return NextResponse.json({ ok: true, id });
}
