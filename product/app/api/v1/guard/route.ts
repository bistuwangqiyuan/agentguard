import { NextResponse } from "next/server";
import { bearerFromRequest } from "@/lib/auth";
import { runGuard } from "@/lib/guard/pipeline";
import { getUsage, incrementUsage, resolveApiKey } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = bearerFromRequest(req);
  if (!key) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Missing Bearer API key" } },
      { status: 401 }
    );
  }

  const auth = await resolveApiKey(key);
  if (!auth) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Invalid API key" } },
      { status: 401 }
    );
  }

  const usage = await getUsage(auth.user.id);
  if (usage.calls >= auth.user.monthlyQuota) {
    return NextResponse.json(
      {
        error: {
          code: "quota_exceeded",
          message: "Monthly quota exceeded",
          plan: auth.user.plan,
          quota: auth.user.monthlyQuota,
          used: usage.calls,
        },
      },
      {
        status: 429,
        headers: { "Retry-After": "86400" },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_request", message: "Body must be JSON" } },
      { status: 400 }
    );
  }

  try {
    const result = await runGuard(body as Parameters<typeof runGuard>[0]);
    const after = await incrementUsage(auth.user.id, 1);
    return NextResponse.json({
      ...result,
      usage: {
        plan: auth.user.plan,
        period: after.period,
        used: after.calls,
        remaining: after.remaining,
        quota: after.quota,
      },
    });
  } catch (e) {
    const err = e as Error & { status?: number; code?: string };
    return NextResponse.json(
      {
        error: {
          code: err.code || "error",
          message: err.message,
          retryable: Boolean((err as { retryable?: boolean }).retryable),
        },
      },
      { status: err.status || 500 }
    );
  }
}
