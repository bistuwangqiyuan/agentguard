export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
      <p className="text-sm text-sub">Last updated: 2026-08-06 · Operator: Wang Qiyuan (AgentGuard)</p>

      <h2>Who we are</h2>
      <p>
        AgentGuard is operated by an individual sole proprietor (Wang Qiyuan) offering a developer
        API for automated text checks. For privacy requests use the{" "}
        <a href="/contact">contact form</a>.
      </p>

      <h2>What we collect</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Account email (authentication, billing linkage).</li>
        <li>API usage counts and plan/subscription status.</li>
        <li>Payment data is collected by <strong>Paddle</strong> as Merchant of Record — we do not store card numbers.</li>
        <li>Optional support messages and refund requests you submit.</li>
        <li>API request bodies are processed to return check results; we do not sell content.</li>
      </ul>

      <h2>Legal bases / purposes</h2>
      <p>
        Provide the service, enforce quotas, prevent abuse, fulfill subscriptions, comply with law,
        and respond to support. Retention: account data while active + up to 24 months after
        closure for billing disputes unless a longer period is required by law.
      </p>

      <h2>International transfers</h2>
      <p>
        Hosting and subprocessors may process data outside your country. See{" "}
        <a href="/subprocessors">Subprocessors</a>. Vendor DPAs / SCCs apply where available.
      </p>

      <h2>Your rights</h2>
      <p>
        Access, correction, deletion, and export requests: use Contact with subject “DSAR”. We
        respond within 30 days where required.
      </p>

      <h2>Cookies</h2>
      <p>
        Essential session cookie (<code>ag_session</code>) for dashboard login. No advertising
        trackers in the default build.
      </p>

      <h2>Children</h2>
      <p>Not directed to children under 16.</p>
    </div>
  );
}
