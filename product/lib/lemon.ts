import { hmacSha256Hex, safeEqualHex } from "./crypto";
import { planFromVariantId, type PlanId } from "./plans";
import {
  claimWebhookEvent,
  findUserByEmail,
  findUserByLemonSubscription,
  setUserPlan,
} from "./store";

export function lemonConfigured(): boolean {
  return Boolean(
    process.env.LEMONSQUEEZY_API_KEY &&
      process.env.LEMONSQUEEZY_STORE_ID &&
      (process.env.LEMONSQUEEZY_VARIANT_BUILDER ||
        process.env.LEMONSQUEEZY_VARIANT_PRO ||
        process.env.LEMONSQUEEZY_VARIANT_SCALE)
  );
}

export function checkoutUrl(plan: PlanId, email: string): string | null {
  if (plan === "free") return null;
  const variantMap: Record<Exclude<PlanId, "free">, string | undefined> = {
    builder: process.env.LEMONSQUEEZY_VARIANT_BUILDER,
    pro: process.env.LEMONSQUEEZY_VARIANT_PRO,
    scale: process.env.LEMONSQUEEZY_VARIANT_SCALE,
  };
  const variant = variantMap[plan];
  if (!variant) return null;
  const custom = process.env[`LEMONSQUEEZY_CHECKOUT_${plan.toUpperCase()}`];
  const url = new URL(custom || `https://app.lemonsqueezy.com/checkout/buy/${variant}`);
  url.searchParams.set("checkout[email]", email);
  url.searchParams.set("checkout[custom][user_email]", email);
  return url.toString();
}

export function verifyLemonSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const digest = hmacSha256Hex(secret, rawBody);
  return safeEqualHex(digest, signature);
}

type LemonEvent = {
  meta?: {
    event_name?: string;
    event_id?: string;
    custom_data?: { user_email?: string; user_id?: string };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      user_email?: string;
      customer_id?: number | string;
      variant_id?: number | string;
      first_subscription_item?: { variant_id?: number | string };
    };
  };
};

export async function handleLemonWebhook(rawBody: string): Promise<{ handled: boolean; detail: string }> {
  const event = JSON.parse(rawBody) as LemonEvent;
  const eventName = event.meta?.event_name || "unknown";
  const eventId = event.meta?.event_id || `${eventName}:${event.data?.id || "na"}`;

  const first = await claimWebhookEvent(eventId, eventName);
  if (!first) return { handled: true, detail: "duplicate" };

  const attrs = event.data?.attributes || {};
  const email =
    event.meta?.custom_data?.user_email ||
    attrs.user_email ||
    undefined;
  const variantId =
    attrs.variant_id || attrs.first_subscription_item?.variant_id;
  const plan = planFromVariantId(variantId);
  const subId = event.data?.id ? String(event.data.id) : undefined;
  const customerId = attrs.customer_id != null ? String(attrs.customer_id) : undefined;

  if (
    eventName === "subscription_created" ||
    eventName === "subscription_updated" ||
    eventName === "subscription_resumed" ||
    eventName === "subscription_payment_success"
  ) {
    if (!plan) return { handled: true, detail: "unknown variant" };
    let user = email ? await findUserByEmail(email) : null;
    if (!user && subId) user = await findUserByLemonSubscription(subId);
    if (!user) return { handled: true, detail: "user not found" };
    if (attrs.status === "expired" || attrs.status === "cancelled") {
      await setUserPlan(user.id, "free", { subscriptionId: subId, customerId });
      return { handled: true, detail: "downgraded free" };
    }
    await setUserPlan(user.id, plan, { subscriptionId: subId, customerId });
    return { handled: true, detail: `upgraded ${plan}` };
  }

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    let user = subId ? await findUserByLemonSubscription(subId) : null;
    if (!user && email) user = await findUserByEmail(email);
    if (!user) return { handled: true, detail: "user not found" };
    // cancelled: keep plan until expired webhook; expired: free
    if (eventName === "subscription_expired") {
      await setUserPlan(user.id, "free", { subscriptionId: subId, customerId });
      return { handled: true, detail: "expired -> free" };
    }
    return { handled: true, detail: "cancelled noted" };
  }

  return { handled: true, detail: `ignored ${eventName}` };
}
