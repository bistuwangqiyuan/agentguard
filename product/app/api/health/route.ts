import { NextResponse } from "next/server";
import { llmConfigured } from "@/lib/llm";
import { billingReady, paddleConfigured, paddleEnv } from "@/lib/paddle";
import { storageMode } from "@/lib/store";

export async function GET() {
  const storage = storageMode();
  return NextResponse.json({
    ok: true,
    service: "agentguard",
    storage,
    storageWarning:
      storage === "memory"
        ? "Memory store resets on cold start — paid billing requires Supabase"
        : null,
    llm: llmConfigured(),
    paddleConfigured: paddleConfigured(),
    billingReady: billingReady(),
    paddleEnv: paddleEnv(),
    time: new Date().toISOString(),
  });
}
