export const metadata = { title: "Docs" };

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Documentation</h1>
      <p className="mt-3 text-lg text-sub">
        AgentGuard is a developer API that checks AI agent outputs before you persist them.
      </p>

      <h2>Quickstart</h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Open <a href="/dashboard">Dashboard</a>, enter your email, copy the Free API key.
        </li>
        <li>Call <code>POST /api/v1/guard</code> with <code>Authorization: Bearer …</code>.</li>
        <li>Inspect <code>ok</code> and structured <code>checks</code>.</li>
      </ol>

      <h2>POST /api/v1/guard</h2>
      <pre>{`{
  "text": "{\\"user\\":\\"ada@example.com\\"}",
  "schema": { "type": "object", "required": ["user"] },
  "mode": "report",
  "checks": ["schema", "pii", "injection"]
}`}</pre>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <code>mode</code>: <code>report</code> (default) or <code>redact</code> (returns{" "}
          <code>text_out</code> with PII masked).
        </li>
        <li>
          <code>schema</code>: optional JSON Schema; when present, <code>text</code> must be JSON.
        </li>
        <li>
          Omitting <code>checks</code> runs all three.
        </li>
      </ul>

      <h2>Auth</h2>
      <p>
        Prefer <code>Authorization: Bearer ag_live_…</code>. <code>X-API-Key</code> is also
        accepted. Get usage with <code>GET /api/v1/me</code>.
      </p>

      <h2>Errors</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <code>401 unauthorized</code> — missing/invalid key
        </li>
        <li>
          <code>429 quota_exceeded</code> — monthly cap hit; <code>Retry-After</code> present
        </li>
        <li>
          <code>413 payload_too_large</code> — text &gt; 100k chars
        </li>
        <li>
          Injection LLM timeouts degrade to rules-only and may set <code>retryable: true</code> in
          notes
        </li>
      </ul>

      <h2>Quotas</h2>
      <p>Free 300 · Builder 10k · Pro 50k · Scale 200k calls per UTC calendar month.</p>

      <h2>EU AI Act transparency</h2>
      <p>
        AgentGuard provides automated assistance for schema/PII/injection checks. It is{" "}
        <strong>not</strong> a high-risk AI system under EU AI Act Annex III. When LLM features are
        enabled, outputs may be probabilistically generated; humans remain responsible for
        safety-critical decisions. This product does not provide legal, medical, or financial
        advice.
      </p>

      <h2>Webhooks (Lemon Squeezy)</h2>
      <p>
        Point Lemon Squeezy to <code>/api/webhooks/lemon</code>. Signature verified via{" "}
        <code>X-Signature</code> HMAC-SHA256 over the raw body. Events are idempotent by{" "}
        <code>meta.event_id</code>.
      </p>
    </div>
  );
}
