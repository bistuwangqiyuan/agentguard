export type PlanId = "free" | "builder" | "pro" | "scale";

export type SubscriptionStatus =
  | "none"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused";

export const PLANS: Record<
  PlanId,
  { name: string; priceUsd: number; monthlyQuota: number; blurb: string }
> = {
  free: {
    name: "Free",
    priceUsd: 0,
    monthlyQuota: 300,
    blurb: "300 calls/mo · no card · community docs",
  },
  builder: {
    name: "Builder",
    priceUsd: 29,
    monthlyQuota: 10_000,
    blurb: "10k calls/mo · all checks · email support",
  },
  pro: {
    name: "Pro",
    priceUsd: 79,
    monthlyQuota: 50_000,
    blurb: "50k calls/mo · higher rate limits · webhooks",
  },
  scale: {
    name: "Scale",
    priceUsd: 199,
    monthlyQuota: 200_000,
    blurb: "200k calls/mo · overage-ready · priority",
  },
};

export function priceIdForPlan(plan: Exclude<PlanId, "free">): string | undefined {
  const map: Record<Exclude<PlanId, "free">, string | undefined> = {
    builder: process.env.PADDLE_PRICE_BUILDER,
    pro: process.env.PADDLE_PRICE_PRO,
    scale: process.env.PADDLE_PRICE_SCALE,
  };
  return map[plan] || undefined;
}

export function planFromPriceId(priceId: string | undefined | null): PlanId | null {
  if (!priceId) return null;
  const map: Record<string, PlanId> = {
    [process.env.PADDLE_PRICE_BUILDER || ""]: "builder",
    [process.env.PADDLE_PRICE_PRO || ""]: "pro",
    [process.env.PADDLE_PRICE_SCALE || ""]: "scale",
  };
  return map[priceId] || null;
}
