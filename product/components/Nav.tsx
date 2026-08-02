import Link from "next/link";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tools/pii-scanner", label: "Tools" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">AgentGuard</span>
          <span className="hidden text-xs text-sub sm:inline">API</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm text-sub transition hover:bg-faint hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="ml-1 rounded-full bg-ink px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-black"
          >
            Get API key
          </Link>
        </nav>
      </div>
    </header>
  );
}
