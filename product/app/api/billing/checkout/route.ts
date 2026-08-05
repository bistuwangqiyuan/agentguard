import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { billingReady, buildCheckoutPayload, paddleConfigured } from "@/lib/paddle";
import { storageMode } from "@/lib/store";
import type { PlanId } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let plan: PlanId = "builder";
  try {
    const body = (await req.json()) as { plan?: PlanId };
    plan = body.plan || "builder";
  } catch {
    /* default */
  }

  if (plan === "free") {
    return NextResponse.json({ error: "Free plan needs no checkout" }, { status: 400 });
  }

  if (!paddleConfigured()) {
    return NextResponse.json(
      {
        error: "Paddle is not configured yet",
        hint: "Seller onboarding required. See product/README.md and ops onboarding guide.",
      },
      { status: 503 }
    );
  }

  if (storageMode() !== "supabase") {
    return NextResponse.json(
      {
        error: "Durable storage required for paid plans",
        hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/schema.sql",
        storage: storageMode(),
      },
      { status: 503 }
    );
  }

  if (!billingReady()) {
    return NextResponse.json({ error: "Billing not ready" }, { status: 503 });
  }

  const payload = buildCheckoutPayload(user, plan);
  if (!payload) {
    return NextResponse.json({ error: "Price ID missing for plan" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, checkout: payload });
}
