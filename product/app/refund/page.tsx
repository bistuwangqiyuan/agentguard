import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Refunds" };

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Refund policy</h1>
      <p className="mt-3 text-sub">
        AgentGuard sells developer API subscriptions. To keep chargeback rates low and treat
        customers fairly, we follow an <strong>instant refund on request</strong> policy for
        digital goods within the paid period when usage is not clearly abusive.
      </p>
      <h2>How it works</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Submit the form below (or email via Contact).</li>
        <li>
          Refunds are executed in the <strong>Paddle</strong> dashboard — Paddle is the Merchant of
          Record and issues the credit to your original payment method.
        </li>
        <li>Typical processing: same business day after the request is logged.</li>
        <li>Abuse (fraud, card testing) may be refused and keys revoked.</li>
      </ul>
      <ContactForm mode="refund" />
    </div>
  );
}
