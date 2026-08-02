import { NextResponse } from "next/server";

/**
 * Monthly usage is keyed by YYYY-MM, so reset is implicit.
 * This cron is a keep-alive ping for free-tier DBs and health telemetry.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET || ""}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    note: "Usage periods are calendar months (UTC). No wipe required.",
    period: new Date().toISOString().slice(0, 7),
  });
}
