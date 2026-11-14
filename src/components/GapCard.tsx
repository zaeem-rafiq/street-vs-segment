import Link from "next/link";
import { Dumbbell } from "@/components/Dumbbell";
import { KnownAnswerLine } from "@/components/KnownAnswer";
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

function SegmentLabel({ run }: { run: Run }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm text-muted" data-testid="segment-label">
      {run.segment.label}
      <span className="whitespace-nowrap rounded bg-chip px-1.5 py-0.5 text-xs font-semibold text-panel">AI panel</span>
    </span>
  );
}

function Gap({ gap, label, large = false }: { gap: number; label: string; large?: boolean }) {
  return (
    <div>
      <p
        className={`font-bold leading-none tracking-tight tabular-nums ${gap === 0 ? "text-ink" : "text-panel"} ${
          large ? "text-7xl sm:text-8xl" : "text-5xl lg:text-6xl"
        }`}
        data-testid="gap-value"
      >
        {formatGap(gap)}
        <span className={`ml-1 font-semibold tracking-normal text-muted ${large ? "text-2xl" : "text-lg"}`}>
          {Math.abs(gap) === 1 ? "pt" : "pts"}
        </span>
      </p>
      <p className="mt-2 text-sm text-muted" data-testid="gap-phrase">
        {describeGap(gap, label)}
      </p>
    </div>
  );
}

export function GapCard({ run, price, linked = true }: Props) {
  const market = roundPercent(price.yesPercent);
  const segment = roundPercent(run.yesShare);
  const gap = gapPoints(run.yesShare, price.yesPercent);

  if (!linked) {
    return (
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,22rem)] lg:items-end lg:gap-16">
        <div className="min-w-0">
          <SegmentLabel run={run} />
          <h1 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {run.question}
          </h1>
          <div className="mt-6 max-w-2xl">
            <Dumbbell market={market} panel={segment} size="lg" />
          </div>
        </div>
        <div className="lg:text-right">
          <Gap gap={gap} label={run.segment.label} large />
          <p className="mt-3 text-sm text-muted" data-testid="price-source">
            {priceNote(price)}
          </p>
          <p className="mt-1 text-sm text-muted">
            {run.panelSize} personas · {run.segment.place}
          </p>
        </div>
      </section>
    );
  }

  // The known-answer line carries its own source link, so it sits outside the card's link
  // (a link inside a link is invalid HTML) but inside the same bordered card.
  return (
    <article className="rounded-xl border border-line bg-card transition-colors has-[a[data-testid=gap-card]:hover]:border-ink">
      <Link
        href={`/m/${encodeURIComponent(run.ticker)}`}
        className="group block rounded-xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:p-6 lg:px-8"
        data-testid="gap-card"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_14rem] lg:items-center lg:gap-10">
          <div className="min-w-0">
            <p className="truncate font-mono text-xs text-muted">{run.ticker}</p>
            <p className="mt-1.5 text-lg font-semibold leading-snug text-ink">{run.question}</p>
            <p className="mt-2">
              <SegmentLabel run={run} />
            </p>
            <p className="mt-1 text-xs text-muted">
              {run.panelSize} personas · {run.segment.place}
            </p>
          </div>
          <div className="order-last min-w-0 lg:order-none">
            <Dumbbell market={market} panel={segment} />
            <p className="mt-1 text-xs text-muted" data-testid="price-source">
              {priceNote(price)}
            </p>
          </div>
          <div className="lg:text-right">
            <Gap gap={gap} label={run.segment.label} />
          </div>
        </div>
        <p className="mt-3 text-sm font-medium text-ink underline-offset-4 group-hover:underline lg:text-right">
          Who was asked and what they said →
        </p>
      </Link>
      {run.knownAnswerCheck && (
        <div className="border-t border-line px-5 py-3 sm:px-6 lg:px-8">
          <KnownAnswerLine check={run.knownAnswerCheck} />
        </div>
      )}
    </article>
  );
}
