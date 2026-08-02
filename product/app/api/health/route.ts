import { NextResponse } from "next/server";
import { llmConfigured } from "@/lib/llm";
import { lemonConfigured } from "@/lib/lemon";
import { storageMode } from "@/lib/store";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "agentguard",
    storage: storageMode(),
    llm: llmConfigured(),
    billing: lemonConfigured(),
    time: new Date().toISOString(),
  });
}
