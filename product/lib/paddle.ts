import { createHmac, timingSafeEqual } from "crypto";
import { planFromPriceId, priceIdForPlan, type PlanId } from "./plans";
import {
  claimWebhookEvent,
  findUserByEmail,
  findUserByPaddleSubscription,
  getUserById,
  setUserBilling,
  storageMode,
} from "./store";

export function paddleConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.PADDLE_PRICE_BUILDER &&
      process.env.PADDLE_PRICE_PRO &&
      process.env.PADDLE_PRICE_SCALE
  );
}

/** Paid checkout requires durable storage — memory mode is demo-only. */
export function billingReady(): boolean {
  return paddleConfigured() && storageMode() === "supabase";
}

export function paddleEnv(): "sandbox" | "production" {
  return process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";
}

export function verifyPaddleSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(";").map((p) => {
      const [k, v] = p.split("=");
      return [k?.trim(), v?.trim()];
    })
  );
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const age = Math.abs(Date.now() / 1000 - Number(ts));
  if (Number.isNaN(age) || age > 300) return false; // 5 minutes

  const signedPayload = `${ts}:${rawBody}`;
  const expected = createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(h1);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type CheckoutPayload = {
  priceId: string;
  plan: PlanId;
  customData: { user_id: string; user_email: string };
  customerEmail: string;
  successUrl: string;
  clientToken: string;
  environment: "sandbox" | "production";
};

export function buildCheckoutPayload(
  user: { id: string; email: string },
  plan: Exclude<PlanId, "free">
): CheckoutPayload | null {
  const priceId = priceIdForPlan(plan);
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!priceId || !clientToken) return null;
  const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return {
    priceId,
    plan,
    customData: { user_id: user.id, user_email: user.email },
    customerEmail: user.email,
    successUrl: `${base}/billing/success?plan=${plan}`,
    clientToken,
    environment: paddleEnv(),
  };
}

type PaddleEvent = {
  event_id?: string;
  event_type?: string;
  data?: {
    id?: string;
    status?: string;
    customer_id?: string;
    custom_data?: { user_id?: string; user_email?: string };
    items?: Array<{ price?: { id?: string } }>;
    subscription_id?: string;
  };
};

function extractPriceId(data: PaddleEvent["data"]): string | undefined {
  return data?.items?.[0]?.price?.id;
}

export async function handlePaddleWebhook(
  rawBody: string
): Promise<{ handled: boolean; detail: string }> {
  const event = JSON.parse(rawBody) as PaddleEvent;
  const eventType = event.event_type || "unknown";
  const eventId = event.event_id || `${eventType}:${event.data?.id || "na"}`;

  const first = await claimWebhookEvent(eventId, eventType);
  if (!first) return { handled: true, detail: "duplicate" };

  const data = event.data || {};
  const custom = data.custom_data || {};
  const priceId = extractPriceId(data);
  const plan = planFromPriceId(priceId);
  const subId = data.id?.startsWith("sub_")
    ? data.id
    : data.subscription_id || data.id;
  const customerId = data.customer_id;

  let user =
    (custom.user_id ? await getUserById(custom.user_id) : null) ||
    (custom.user_email ? await findUserByEmail(custom.user_email) : null) ||
    (subId ? await findUserByPaddleSubscription(subId) : null);

  if (
    eventType === "subscription.created" ||
    eventType === "subscription.activated" ||
    eventType === "subscription.updated" ||
    eventType === "subscription.trialing" ||
    eventType === "transaction.completed"
  ) {
    if (!user) return { handled: true, detail: "user not found" };
    const status = data.status || "active";
    if (status === "canceled" || status === "past_due") {
      await setUserBilling(user.id, {
        plan: status === "canceled" ? "free" : user.plan,
        subscriptionStatus: status === "canceled" ? "canceled" : "past_due",
        paddleSubscriptionId: subId,
        paddleCustomerId: customerId,
        cancelAtPeriodEnd: status === "canceled",
      });
      return { handled: true, detail: `status ${status}` };
    }
    if (!plan && user.plan === "free") {
      return { handled: true, detail: "unknown price" };
    }
    await setUserBilling(user.id, {
      plan: plan || user.plan,
      subscriptionStatus: status === "trialing" ? "trialing" : "active",
      paddleSubscriptionId: subId,
      paddleCustomerId: customerId,
      cancelAtPeriodEnd: false,
    });
    return { handled: true, detail: `upgraded ${plan || user.plan}` };
  }

  if (
    eventType === "subscription.canceled" ||
    eventType === "subscription.past_due" ||
    eventType === "subscription.paused"
  ) {
    if (!user && subId) user = await findUserByPaddleSubscription(subId);
    if (!user) return { handled: true, detail: "user not found" };
    if (eventType === "subscription.canceled") {
      await setUserBilling(user.id, {
        plan: "free",
        subscriptionStatus: "canceled",
        paddleSubscriptionId: subId,
        paddleCustomerId: customerId,
        cancelAtPeriodEnd: true,
      });
      return { handled: true, detail: "canceled -> free" };
    }
    if (eventType === "subscription.past_due") {
      await setUserBilling(user.id, {
        plan: user.plan,
        subscriptionStatus: "past_due",
        paddleSubscriptionId: subId,
        paddleCustomerId: customerId,
      });
      return { handled: true, detail: "past_due" };
    }
    await setUserBilling(user.id, {
      plan: user.plan,
      subscriptionStatus: "paused",
      paddleSubscriptionId: subId,
      paddleCustomerId: customerId,
    });
    return { handled: true, detail: "paused" };
  }

  if (eventType === "subscription.resumed") {
    if (!user && subId) user = await findUserByPaddleSubscription(subId);
    if (!user) return { handled: true, detail: "user not found" };
    await setUserBilling(user.id, {
      plan: plan || user.plan,
      subscriptionStatus: "active",
      paddleSubscriptionId: subId,
      paddleCustomerId: customerId,
      cancelAtPeriodEnd: false,
    });
    return { handled: true, detail: "resumed" };
  }

  return { handled: true, detail: `ignored ${eventType}` };
}

/** Create a customer portal session URL via Paddle API (when API key set). */
export async function createPortalUrl(customerId: string): Promise<string | null> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey || !customerId) return null;
  const base =
    paddleEnv() === "production"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com";
  try {
    const res = await fetch(`${base}/customers/${customerId}/portal-sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { urls?: { general?: { overview?: string } } };
    };
    return json.data?.urls?.general?.overview || null;
  } catch {
    return null;
  }
}
