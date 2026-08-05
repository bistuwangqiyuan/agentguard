import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createPortalUrl } from "@/lib/paddle";

export const runtime = "nodejs";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (!user.paddleCustomerId) {
    return NextResponse.json(
      {
        error: "No Paddle customer yet",
        hint: "Complete a checkout first, or manage billing from the receipt email.",
      },
      { status: 400 }
    );
  }
  const url = await createPortalUrl(user.paddleCustomerId);
  if (!url) {
    return NextResponse.json(
      {
        error: "Portal unavailable",
        hint: "Set PADDLE_API_KEY or open the customer portal link from your Paddle receipt email.",
      },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: true, url });
}
