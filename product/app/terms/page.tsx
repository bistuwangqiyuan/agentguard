export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Terms of Service</h1>
      <p className="text-sm text-sub">Last updated: 2026-08-06 · Operator: Wang Qiyuan (AgentGuard)</p>

      <h2>Service</h2>
      <p>
        AgentGuard provides automated guardrail checks (schema, PII, injection heuristics) for
        developers. Results are assistive; ML-assisted checks are probabilistic. You are
        responsible for downstream decisions. Not legal, medical, or financial advice.
      </p>

      <h2>Accounts &amp; API keys</h2>
      <p>
        Keep keys secret. You are responsible for usage under your keys. We may revoke keys for
        AUP violations or abuse.
      </p>

      <h2>Acceptable use</h2>
      <p>
        You must comply with the <a href="/aup">Acceptable Use Policy</a>.
      </p>

      <h2>Billing</h2>
      <p>
        Paid plans are billed by <strong>Paddle.com Market Ltd</strong> (or affiliates) as Merchant
        of Record. Prices exclude taxes that Paddle may collect at checkout. Cancel anytime via
        the customer portal; access continues until period end when applicable. Refunds: see{" "}
        <a href="/refund">Refund policy</a>.
      </p>

      <h2>AI transparency</h2>
      <p>
        When LLM features are enabled, parts of the response may be model-generated. AgentGuard is
        not offered as an EU AI Act Annex III high-risk system. Humans remain accountable for
        safety-critical use.
      </p>

      <h2>Disclaimer &amp; liability</h2>
      <p>
        Provided “as is”. To the extent permitted by law, liability is limited to fees paid to
        Paddle for AgentGuard in the prior three months.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the People&apos;s Republic of China for disputes
        with the operator, without prejudice to mandatory consumer protections in your
        jurisdiction. Payment relationship with Paddle is also subject to Paddle&apos;s buyer
        terms.
      </p>
    </div>
  );
}
