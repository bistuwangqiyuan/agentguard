export const metadata = { title: "Docs" };

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Documentation</h1>
      <p className="mt-3 text-lg text-sub">
        AgentGuard checks AI agent outputs before you persist them. Global billing via Paddle MoR.
      </p>

      <h2>Quickstart</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Open <a href="/dashboard">Dashboard</a>, enter your email, copy the Free API key.
        </li>
        <li>
          Call <code>POST /api/v1/guard</code> with <code>Authorization: Bearer …</code>.
        </li>
        <li>
          Inspect <code>ok</code> and structured <code>checks</code>.
        </li>
      </ol>

      <pre>{`curl -X POST https://agentguard-swart.vercel.app/api/v1/guard \\
  -H "Authorization: Bearer ag_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"text":"{\\"email\\":\\"a@b.com\\"}","mode":"redact"}'`}</pre>

      <h2>POST /api/v1/guard</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <code>mode</code>: <code>report</code> or <code>redact</code>
        </li>
        <li>
          <code>schema</code>: optional JSON Schema (text must be JSON)
        </li>
        <li>
          <code>checks</code>: subset of <code>schema</code>, <code>pii</code>,{" "}
          <code>injection</code>
        </li>
      </ul>

      <h2>Billing &amp; quotas</h2>
      <p>Free 300 · Builder 10k · Pro 50k · Scale 200k calls per UTC calendar month.</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Checkout opens Paddle.js overlay from the Dashboard (requires Supabase + Paddle env).</li>
        <li>
          Webhook: <code>POST /api/webhooks/paddle</code> with <code>Paddle-Signature</code>{" "}
          verification; idempotent by <code>event_id</code>.
        </li>
        <li>
          <code>past_due</code>: update card via customer portal; continued failure may drop to Free.
        </li>
        <li>
          Refunds: <a href="/refund">/refund</a> — executed in Paddle as MoR.
        </li>
      </ul>

      <h2>Errors</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <code>401</code> unauthorized · <code>429</code> quota_exceeded · <code>413</code>{" "}
          payload_too_large
        </li>
      </ul>

      <h2>EU AI Act transparency</h2>
      <p>
        Automated assistance for schema/PII/injection checks — not marketed as an Annex III
        high-risk system. Probabilistic components may err; humans remain responsible.
      </p>
    </div>
  );
}
