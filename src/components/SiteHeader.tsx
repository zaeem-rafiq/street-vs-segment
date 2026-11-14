import Link from "next/link";

// The top bar: the wordmark, plus whatever the page puts on the right.
export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line pb-4">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="size-2.5 rounded-sm bg-panel" aria-hidden />
        Street vs. Segment
      </Link>
      {children}
    </header>
  );
}

// "Live Kalshi prices" only when every price on the page came from Kalshi just now; when any
// card fell back to its saved price, it says so instead, so a saved price is never called live.
export function PriceStatus({ live }: { live: boolean }) {
  return (
    <p className="flex items-center gap-2 text-xs font-medium text-muted" data-testid="price-status">
      <span className={`size-1.5 shrink-0 rounded-full ${live ? "bg-live" : "bg-muted"}`} aria-hidden />
      <span>
        {live ? "Live Kalshi prices" : "Some prices are saved, not live"}
        <span className="hidden sm:inline"> · Flashpoint.AI panels</span>
      </span>
    </p>
  );
}
