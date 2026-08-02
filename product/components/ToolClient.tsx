"use client";

import { useState } from "react";

export function ToolClient({
  tool,
  title,
  blurb,
  placeholder,
}: {
  tool: "pii" | "injection";
  title: string;
  blurb: string;
  placeholder: string;
}) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-sm font-medium text-accent">Free tool · no API key</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sub">{blurb}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder={placeholder}
        className="mt-6 w-full rounded-2xl border border-line bg-white/90 p-4 font-mono text-sm outline-none focus:border-accent"
      />
      <button
        onClick={run}
        disabled={busy || !text.trim()}
        className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Running…" : "Run check"}
      </button>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      {result != null && (
        <pre className="mt-6 overflow-x-auto rounded-2xl bg-ink p-4 text-[13px] text-white">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
