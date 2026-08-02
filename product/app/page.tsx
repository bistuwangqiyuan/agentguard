import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pt-24">
          <p className="text-sm font-medium tracking-wide text-accent">AGENTGUARD</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-6xl sm:leading-[1.05]">
            Make agent outputs safe to store.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-sub">
            One HTTP call for JSON Schema validation, PII detection & redaction, and
            prompt-injection checks — built for AI-agent builders who need machine-readable
            guardrails, not another chatbot UI.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              Start free — 300 calls/mo
            </Link>
            <Link
              href="/docs"
              className="rounded-full border border-line bg-white/80 px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white"
            >
              Read the docs
            </Link>
          </div>
          <pre className="mt-12 overflow-x-auto rounded-2xl bg-ink p-5 text-[13px] leading-6 text-white/90 shadow-xl">
{`curl -X POST https://agentguard-swart.vercel.app/api/v1/guard \\
  -H "Authorization: Bearer ag_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"text":"{\\"email\\":\\"a@b.com\\"}","checks":["pii","injection"],"mode":"redact"}'`}
          </pre>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Schema",
              d: "Validate agent JSON against your schema with Ajv — deterministic, no LLM cost.",
            },
            {
              t: "PII",
              d: "Detect email, phone, SSN, cards, API keys; redact with mode=redact.",
            },
            {
              t: "Injection",
              d: "Rules + optional LLM classifier. Failures are structured and retryable.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-line/80 bg-white/70 p-6">
              <h2 className="text-lg font-semibold">{c.t}</h2>
              <p className="mt-2 text-sm leading-6 text-sub">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="text-2xl font-semibold tracking-tight">Built for zero-touch ops</h2>
        <p className="mt-2 max-w-2xl text-sub">
          Self-serve keys, monthly quotas, Lemon Squeezy billing webhooks, docs-first support.
          No sales calls. No enterprise theater.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/tools/pii-scanner" className="text-accent hover:underline">
            Free PII scanner →
          </Link>
          <Link href="/tools/injection-check" className="text-accent hover:underline">
            Free injection checker →
          </Link>
          <Link href="/pricing" className="text-accent hover:underline">
            Pricing →
          </Link>
        </div>
      </section>
    </div>
  );
}
