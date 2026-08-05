import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 prose-doc">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">Contact</h1>
      <p className="mt-3 text-sub">
        Solo-operated product. Prefer docs first; for billing, privacy (DSAR), or product issues,
        use this form. Messages are stored and optionally emailed to ops when Resend is configured.
      </p>
      <ContactForm mode="contact" />
    </div>
  );
}
