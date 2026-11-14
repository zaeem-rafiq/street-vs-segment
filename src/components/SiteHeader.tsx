import Link from "next/link";

// The top bar. "Live Kalshi prices" shows only when every price on the page came from
// Kalshi just now; when any card fell back to its saved price, the bar says so instead.
export function SiteHeader({ live, children }: { live?: boolean; children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line pb-4">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="size-2.5 rounded-sm bg-panel" aria-hidden />
        Street vs. Segment
      </Link>
      {children ??
        (live === undefined ? null : (
          <p className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className={`size-1.5 rounded-full ${live ? "bg-live" : "bg-muted"}`} aria-hidden />
            <span>
              {live ? "Live Kalshi prices" : "Some prices are saved, not live"}
              <span className="hidden sm:inline"> · Flashpoint.AI panels</span>
            </span>
          </p>
        ))}
    </header>
  );
}
