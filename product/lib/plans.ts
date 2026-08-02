export type PlanId = "free" | "builder" | "pro" | "scale";

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

export function planFromVariantId(variantId: string | number | undefined): PlanId | null {
  if (variantId == null) return null;
  const v = String(variantId);
  const map: Record<string, PlanId> = {
    [process.env.LEMONSQUEEZY_VARIANT_BUILDER || ""]: "builder",
    [process.env.LEMONSQUEEZY_VARIANT_PRO || ""]: "pro",
    [process.env.LEMONSQUEEZY_VARIANT_SCALE || ""]: "scale",
  };
  return map[v] || null;
}
