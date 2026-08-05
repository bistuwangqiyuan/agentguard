import { NextResponse } from "next/server";

/** Lemon Squeezy retired for this product — use /api/webhooks/paddle */
export async function POST() {
  return NextResponse.json(
    {
      error: "gone",
      message: "Billing moved to Paddle. Configure /api/webhooks/paddle instead.",
    },
    { status: 410 }
  );
}
