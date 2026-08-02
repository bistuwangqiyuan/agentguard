import { NextResponse } from "next/server";
import { checkInjectionRules } from "@/lib/guard/injection";
import { checkPii } from "@/lib/guard/pii";

export const runtime = "nodejs";

const buckets = new Map<string, { n: number; reset: number }>();

function rateLimit(ip: string, limit = 30): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.reset < now) {
    buckets.set(ip, { n: 1, reset: now + 60_000 });
    return true;
  }
  if (b.n >= limit) return false;
  b.n += 1;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit: 30/min" }, { status: 429 });
  }

  let body: { tool?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const text = body.text || "";
  if (!text || text.length > 20_000) {
    return NextResponse.json({ error: "text required (max 20k)" }, { status: 400 });
  }

  if (body.tool === "pii") {
    return NextResponse.json({ tool: "pii", ...checkPii(text) });
  }
  if (body.tool === "injection") {
    return NextResponse.json({ tool: "injection", ...checkInjectionRules(text) });
  }
  return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
}
