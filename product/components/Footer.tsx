import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/80 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold">AgentGuard</div>
          <p className="mt-1 max-w-md text-sm text-sub">
            Make agent outputs trustworthy enough to store — schema, PII, injection checks.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-sub">
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/aup" className="hover:text-ink">
            AUP
          </Link>
          <Link href="/docs" className="hover:text-ink">
            Docs
          </Link>
          <a href="/api/health" className="hover:text-ink">
            Status
          </a>
        </div>
      </div>
    </footer>
  );
}
