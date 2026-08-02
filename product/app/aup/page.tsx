export const metadata = { title: "Acceptable Use" };

export default function AupPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Acceptable Use Policy</h1>
      <p className="text-sm text-sub">Last updated: 2026-08-03</p>
      <h2>Allowed</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Validating and redacting text/JSON from AI agents and apps you control.</li>
        <li>Building developer tools that call AgentGuard as infrastructure.</li>
      </ul>
      <h2>Not allowed</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Illegal activity, malware facilitation, or fraud.</li>
        <li>Generating or distributing non-consensual intimate imagery, deepfakes of real people, or voice cloning products.</li>
        <li>Attempting to bypass rate limits, steal keys, or attack the service.</li>
        <li>Using the service to target minors with sexual content.</li>
        <li>High-risk medical/legal/financial advice presented as professional counsel.</li>
      </ul>
      <h2>Enforcement</h2>
      <p>Violations may result in immediate key revocation without refund for abusive use.</p>
    </div>
  );
}
