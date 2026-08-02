import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { getOrCreateUserByEmail } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: string };
    email = body.email || "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const { user, created, apiKeyPlain } = await getOrCreateUserByEmail(email);
    await setSessionCookie(user.id);
    return NextResponse.json({
      ok: true,
      created,
      email: user.email,
      plan: user.plan,
      // Only returned once at signup — store it now.
      apiKey: apiKeyPlain || null,
      note: apiKeyPlain
        ? "Save this API key now. It will not be shown again."
        : "Welcome back. Manage keys in the dashboard.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Login failed" },
      { status: 400 }
    );
  }
}
