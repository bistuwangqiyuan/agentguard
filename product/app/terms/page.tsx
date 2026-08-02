export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Terms of Service</h1>
      <p className="text-sm text-sub">Last updated: 2026-08-03</p>
      <h2>Service</h2>
      <p>
        AgentGuard provides automated guardrail checks for developer use. Results are assistive and
        probabilistic where ML is used. You are responsible for downstream decisions.
      </p>
      <h2>Acceptable use</h2>
      <p>
        You must comply with the <a href="/aup">Acceptable Use Policy</a>. We may suspend keys that
        violate AUP or create abuse risk.
      </p>
      <h2>Billing</h2>
      <p>
        Paid plans are billed by Lemon Squeezy. Instant refunds on request within the MoR policy
        window. Cancel anytime; access continues until period end when applicable.
      </p>
      <h2>Disclaimer</h2>
      <p>
        Provided “as is” without warranties. Not for medical, legal, or financial advice. Liability
        limited to fees paid in the prior 3 months to the extent permitted by law.
      </p>
    </div>
  );
}
