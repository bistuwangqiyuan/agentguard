import Link from "next/link";

export const metadata = { title: "Payment success" };

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <p className="text-sm font-medium text-accent">PAYMENT RECEIVED</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">You&apos;re upgraded</h1>
      <p className="mt-3 text-sub">
        {sp.plan
          ? `Plan: ${sp.plan}. `
          : ""}
        Paddle (Merchant of Record) processes the charge and sends the receipt. Entitlements
        sync via webhook within seconds — refresh the dashboard if quotas look unchanged.
      </p>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
