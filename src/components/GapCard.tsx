import Link from "next/link";
import { describeGap, formatGap, gapPoints, roundPercent } from "@/lib/gap";
import { formatTime } from "@/lib/format";
import type { MarketPrice } from "@/lib/kalshi";
import type { Run } from "@/lib/run-schema";

type Props = { run: Run; price: MarketPrice; linked?: boolean };

export function priceNote(price: MarketPrice): string {
  const time = formatTime(price.lastTradeTime);
  if (price.source === "saved") return `Saved price${time ? `, ${time}` : ""}`;
  const parts = [time ? `Last trade ${time}` : "Last trade time unavailable"];
  if (price.spreadPoints !== null) {
    parts.push(`bid-ask spread ${price.spreadPoints} ${price.spreadPoints === 1 ? "pt" : "pts"}`);
  }
  return parts.join(" · ");
}

export function GapCard({ run, price, linked = true }: Props) {
  const market = roundPercent(price.yesPercent);
  const segment = roundPercent(run.yesShare);
  const gap = gapPoints(run.yesShare, price.yesPercent);

  const body = (
    <>
      <p className="text-lg font-medium leading-snug text-ink">{run.question}</p>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:items-end">
        <div>
          <p className="text-sm font-medium text-muted">Kalshi market says Yes</p>
          <p className="text-5xl font-semibold tabular-nums text-ink" data-testid="market-percent">
            {market}%
          </p>
          <p className="mt-1 text-sm text-muted" data-testid="price-source">
            {priceNote(price)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted" data-testid="segment-label">
            {run.segment.label} · <span className="whitespace-nowrap rounded bg-chip px-1.5 py-0.5 text-xs">AI panel</span>
          </p>
          <p className="text-5xl font-semibold tabular-nums text-ink" data-testid="segment-percent">
            {segment}%
          </p>
          <p className="mt-1 text-sm text-muted">
            {run.panelSize} personas · {run.segment.place}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm font-medium text-muted">Gap</p>
          <p
            className={`text-6xl font-bold tabular-nums sm:text-7xl ${gap < 0 ? "text-down" : gap > 0 ? "text-up" : "text-ink"}`}
            data-testid="gap-value"
          >
            {formatGap(gap)}
            <span className="ml-1 text-2xl font-semibold">{Math.abs(gap) === 1 ? "pt" : "pts"}</span>
          </p>
          <p className="mt-1 text-sm text-ink" data-testid="gap-phrase">
            {describeGap(gap, run.segment.label)}
          </p>
        </div>
      </div>
    </>
  );

  if (!linked) {
    return <section className="rounded-2xl border border-line bg-card p-5 sm:p-7">{body}</section>;
  }
  return (
    <Link
      href={`/m/${encodeURIComponent(run.ticker)}`}
      className="block rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:p-7"
      data-testid="gap-card"
    >
      {body}
      <p className="mt-5 text-sm font-medium text-accent">See who was asked and what they said →</p>
    </Link>
  );
}
