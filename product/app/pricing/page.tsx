import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plans";
import { billingReady } from "@/lib/paddle";
import { storageMode } from "@/lib/store";

const order: PlanId[] = ["free", "builder", "pro", "scale"];

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  const ready = billingReady();
  const storage = storageMode();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Simple developer pricing</h1>
      <p className="mt-3 max-w-2xl text-sub">
        Global checkout via <strong>Paddle</strong> as Merchant of Record — Paddle is the legal
        seller, collects payment, and remits US sales tax / EU VAT where applicable. Cancel
        anytime. Instant refunds on request (
        <Link href="/refund" className="text-accent hover:underline">
          refund policy
        </Link>
        ).
      </p>

      {!ready && (
        <p className="mt-4 rounded-xl border border-warn/30 bg-amber-50 px-4 py-3 text-sm text-warn">
          Paid checkout activates after Paddle seller onboarding
          {storage !== "supabase" ? " and Supabase configuration" : ""}. Free plan is available
          now.
        </p>
      )}

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {order.map((id) => {
          const p = PLANS[id];
          const featured = id === "builder";
          return (
            <div
              key={id}
              className={`rounded-2xl border p-6 ${
                featured
                  ? "border-accent bg-white shadow-lg shadow-accent/10"
                  : "border-line/80 bg-white/70"
              }`}
            >
              <div className="text-sm font-medium text-sub">{p.name}</div>
              <div className="mt-2 text-3xl font-semibold">
                ${p.priceUsd}
                <span className="text-base font-normal text-sub">/mo</span>
              </div>
              <p className="mt-3 text-sm text-sub">{p.blurb}</p>
              <Link
                href="/dashboard"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold ${
                  featured ? "bg-accent text-white" : "border border-line bg-faint text-ink"
                }`}
              >
                {id === "free" ? "Get free key" : "Upgrade in dashboard"}
              </Link>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-sub">
        Displayed prices are exclusive of local taxes that Paddle may collect at checkout. No
        annual lock-in. See <Link href="/terms">Terms</Link> and{" "}
        <Link href="/docs">Billing docs</Link>.
      </p>
    </div>
  );
}
