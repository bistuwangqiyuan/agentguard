"use client";

import { useState } from "react";

export function ContactForm({ mode }: { mode: "contact" | "refund" }) {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(mode === "refund" ? "Refund request" : "");
  const [body, setBody] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError(null);
    setOk(null);
    try {
      const url = mode === "refund" ? "/api/billing/refund" : "/api/contact";
      const payload =
        mode === "refund"
          ? { email, reason: body }
          : { email, subject, body };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOk(data.note || "Message received. We will respond by email.");
      setBody("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
      />
      {mode === "contact" && (
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
        />
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        placeholder={
          mode === "refund"
            ? "Why you need a refund (include approximate charge date if known)"
            : "How can we help?"
        }
        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
      />
      <button
        onClick={submit}
        disabled={busy}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Sending…" : mode === "refund" ? "Submit refund request" : "Send message"}
      </button>
      {ok && <p className="text-sm text-ok">{ok}</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
