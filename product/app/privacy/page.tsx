export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
      <p className="text-sm text-sub">Last updated: 2026-08-03</p>
      <h2>What we collect</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Account email for authentication and billing.</li>
        <li>API usage counts (not request body content in logs).</li>
        <li>Payment data is handled by Lemon Squeezy (Merchant of Record); we do not store cards.</li>
      </ul>
      <h2>API content</h2>
      <p>
        Request text is processed in memory to return check results. We do not sell your content.
        Avoid sending secrets you cannot afford to transmit; prefer redaction workflows.
      </p>
      <h2>Subprocessors</h2>
      <p>
        Hosting (Vercel), optional database (Supabase), optional LLM provider (OpenAI-compatible),
        optional email (Resend), payments (Lemon Squeezy).
      </p>
      <h2>Contact</h2>
      <p>Use the email on your account for privacy requests (access/deletion).</p>
    </div>
  );
}
