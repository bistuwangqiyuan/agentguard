"use client";

import { useState } from "react";
import { PLANS, type PlanId } from "@/lib/plans";

type Me = {
  email: string;
  plan: PlanId;
  monthlyQuota: number;
  usage: { period: string; calls: number };
  keys: Array<{ id: string; prefix: string; name: string; createdAt: string }>;
};

export function DashboardClient({
  initial,
  checkout,
  billingReady,
}: {
  initial: Me | null;
  checkout: Partial<Record<PlanId, string | null>>;
  billingReady: boolean;
}) {
  const [email, setEmail] = useState("");
  const [me, setMe] = useState<Me | null>(initial);
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const meRes = await fetch("/api/v1/me");
      setMe(await meRes.json());
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
      const meRes = await fetch("/api/v1/me");
      setMe(await meRes.json());
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

  if (!me) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Get your API key</h1>
        <p className="mt-2 text-sub">
          Enter your email. No password — we create a Free plan and issue a key instantly.
          (Magic-link email delivery is optional when Resend is configured.)
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

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
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

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Plan" value={PLANS[me.plan].name} />
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
        <h2 className="text-lg font-semibold">Upgrade</h2>
        {!billingReady && (
          <p className="mt-2 text-sm text-warn">
            Lemon Squeezy is not configured on this deployment. Set variant env vars to enable
            checkout.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {(["builder", "pro", "scale"] as PlanId[]).map((id) => {
            const url = checkout[id];
            return url ? (
              <a
                key={id}
                href={url}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                {PLANS[id].name} — ${PLANS[id].priceUsd}/mo
              </a>
            ) : (
              <span
                key={id}
                className="rounded-full border border-dashed border-line px-4 py-2 text-sm text-sub"
              >
                {PLANS[id].name} (checkout pending)
              </span>
            );
          })}
        </div>
      </section>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/80 p-4">
      <div className="text-xs uppercase tracking-wide text-sub">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
