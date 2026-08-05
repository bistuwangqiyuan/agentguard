"use client";

import Script from "next/script";
import { useState } from "react";
import { PLANS, type PlanId, type SubscriptionStatus } from "@/lib/plans";

type Me = {
  email: string;
  plan: PlanId;
  monthlyQuota: number;
  subscriptionStatus: SubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  usage: { period: string; calls: number };
  keys: Array<{ id: string; prefix: string; name: string; createdAt: string }>;
};

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: string) => void };
      Initialize: (opts: { token: string }) => void;
      Checkout: {
        open: (opts: Record<string, unknown>) => void;
      };
    };
  }
}

export function DashboardClient({
  initial,
  billingReady,
  storageMode,
}: {
  initial: Me | null;
  billingReady: boolean;
  storageMode: "memory" | "supabase";
}) {
  const [email, setEmail] = useState("");
  const [me, setMe] = useState<Me | null>(initial);
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paddleReady, setPaddleReady] = useState(false);

  async function refreshMe() {
    const meRes = await fetch("/api/v1/me");
    if (meRes.ok) setMe(await meRes.json());
  }

  async function login() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      if (data.apiKey) setFreshKey(data.apiKey);
      await refreshMe();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function rotate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/rotate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rotate failed");
      setFreshKey(data.apiKey);
      await refreshMe();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setFreshKey(null);
  }

  async function startCheckout(plan: PlanId) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.hint || "Checkout failed");
      const c = data.checkout as {
        priceId: string;
        clientToken: string;
        environment: string;
        customData: Record<string, string>;
        customerEmail: string;
        successUrl: string;
      };
      if (!window.Paddle) throw new Error("Paddle.js not loaded");
      window.Paddle.Environment.set(c.environment);
      window.Paddle.Initialize({ token: c.clientToken });
      window.Paddle.Checkout.open({
        items: [{ priceId: c.priceId, quantity: 1 }],
        customer: { email: c.customerEmail },
        customData: c.customData,
        settings: {
          successUrl: c.successUrl,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function openPortal() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.hint || "Portal failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  if (!me) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Get your API key</h1>
        <p className="mt-2 text-sub">
          Enter your email. No password — we create a Free plan and issue a key instantly.
        </p>
        <div className="mt-6 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <button
            onClick={login}
            disabled={busy || !email.includes("@")}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "…" : "Continue"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </div>
    );
  }

  const remaining = Math.max(0, me.monthlyQuota - me.usage.calls);
  const paid = me.plan !== "free";

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={() => setPaddleReady(true)}
        strategy="afterInteractive"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sub">{me.email}</p>
        </div>
        <button onClick={logout} className="text-sm text-sub hover:text-ink">
          Sign out
        </button>
      </div>

      {freshKey && (
        <div className="mt-6 rounded-2xl border border-ok/30 bg-green-50 p-4">
          <div className="text-sm font-semibold text-ok">Save your API key now</div>
          <code className="mt-2 block break-all font-mono text-sm">{freshKey}</code>
        </div>
      )}

      {me.subscriptionStatus === "past_due" && (
        <div className="mt-6 rounded-2xl border border-warn/40 bg-amber-50 p-4 text-sm">
          Payment past due. Update your card in the billing portal to keep paid quotas.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat label="Plan" value={PLANS[me.plan].name} />
        <Stat label="Status" value={me.subscriptionStatus} />
        <Stat label="Period" value={me.usage.period} />
        <Stat label="Remaining" value={`${remaining} / ${me.monthlyQuota}`} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">API keys</h2>
        <ul className="mt-3 space-y-2">
          {me.keys.map((k) => (
            <li
              key={k.id}
              className="flex items-center justify-between rounded-xl border border-line bg-white/80 px-4 py-3 text-sm"
            >
              <span className="font-mono">
                {k.prefix}… <span className="text-sub">({k.name})</span>
              </span>
              <span className="text-sub">{new Date(k.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={rotate}
          disabled={busy}
          className="mt-4 rounded-full border border-line bg-faint px-4 py-2 text-sm font-medium"
        >
          Rotate key
        </button>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Billing</h2>
        <p className="mt-2 text-sm text-sub">
          Global payments via <strong>Paddle</strong> (Merchant of Record). Tax/VAT handled by
          Paddle. Cancel anytime.
        </p>
        {!billingReady && (
          <p className="mt-2 text-sm text-warn">
            {storageMode !== "supabase"
              ? "Paid checkout requires Supabase (durable storage). Free keys still work."
              : "Paddle is not configured yet — seller onboarding in progress. Free plan works."}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {(["builder", "pro", "scale"] as PlanId[]).map((id) => {
            const current = me.plan === id;
            return (
              <button
                key={id}
                disabled={busy || current || !billingReady || !paddleReady}
                onClick={() => startCheckout(id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40 ${
                  current
                    ? "border border-ok bg-green-50 text-ok"
                    : "bg-accent text-white"
                }`}
              >
                {current ? `Current · ${PLANS[id].name}` : `${PLANS[id].name} — $${PLANS[id].priceUsd}/mo`}
              </button>
            );
          })}
        </div>
        {paid && (
          <button
            onClick={openPortal}
            disabled={busy}
            className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-medium"
          >
            Manage subscription / update card
          </button>
        )}
        <p className="mt-3 text-sm">
          <a href="/refund" className="text-accent hover:underline">
            Request a refund
          </a>
        </p>
      </section>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/80 p-4">
      <div className="text-xs uppercase tracking-wide text-sub">{label}</div>
      <div className="mt-1 text-lg font-semibold capitalize">{value}</div>
    </div>
  );
}
