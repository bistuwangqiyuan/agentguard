import Link from "next/link";

export const metadata = { title: "Checkout canceled" };

export default function BillingCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout canceled</h1>
      <p className="mt-3 text-sub">
        No charge was made. Your Free plan and API key still work. You can retry anytime.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          Dashboard
        </Link>
        <Link
          href="/pricing"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold"
        >
          Pricing
        </Link>
      </div>
    </div>
  );
}
