import Link from "next/link";
import { PLANS, type PlanId } from "@/lib/plans";

const order: PlanId[] = ["free", "builder", "pro", "scale"];

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Simple developer pricing</h1>
      <p className="mt-3 max-w-2xl text-sub">
        Free tier hard-capped at 300 calls/month. Paid plans via Lemon Squeezy (Merchant of
        Record) — tax handled for you. Instant refunds on request.
      </p>
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
                  featured
                    ? "bg-accent text-white"
                    : "border border-line bg-faint text-ink"
                }`}
              >
                {id === "free" ? "Get free key" : "Upgrade in dashboard"}
              </Link>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-sub">
        Checkout links activate when Lemon Squeezy variant IDs are configured in environment
        variables. Until then you can develop against the Free plan.
      </p>
    </div>
  );
}
