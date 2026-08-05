export const metadata = { title: "Subprocessors" };

const rows = [
  ["Vercel", "Hosting / edge", "United States"],
  ["Supabase", "Database (when configured)", "United States / EU (project choice)"],
  ["Paddle", "Payments · Merchant of Record · tax", "United Kingdom / United States"],
  ["LLM provider (optional)", "Injection / semantic PII assist", "Per LLM_BASE_URL"],
  ["Resend (optional)", "Transactional email", "United States"],
];

export default function SubprocessorsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Subprocessors</h1>
      <p className="mt-3 text-sub">
        Third parties that may process customer data to deliver AgentGuard. We only share what is
        needed to provide the service.
      </p>
      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-sub">
            <th className="py-2 pr-4">Vendor</th>
            <th className="py-2 pr-4">Purpose</th>
            <th className="py-2">Region</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b, c]) => (
            <tr key={a} className="border-b border-line/70">
              <td className="py-3 pr-4 font-medium">{a}</td>
              <td className="py-3 pr-4 text-sub">{b}</td>
              <td className="py-3 text-sub">{c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
