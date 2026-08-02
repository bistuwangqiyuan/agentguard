import { ToolClient } from "@/components/ToolClient";

export const metadata = { title: "Free PII scanner" };

export default function PiiToolPage() {
  return (
    <ToolClient
      tool="pii"
      title="PII scanner"
      blurb="Detect emails, phones, SSNs, cards, and API-key shaped secrets in agent output. Rate-limited; for the production API use /api/v1/guard."
      placeholder='Paste text, e.g. Contact jane@example.com or card 4111 1111 1111 1111'
    />
  );
}
