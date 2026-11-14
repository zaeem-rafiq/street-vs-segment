import { panelShareAbove, type LadderRung } from "@/lib/ladder";
import type { Run } from "@/lib/run-schema";

type Estimate = NonNullable<Run["estimate"]>;

// Formats a strike or estimate in the estimate's unit: "4%" for percent, "$3.70" for dollars.
export function formatValue(value: number, unit: string): string {
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, "");
  if (/percent|%/i.test(unit)) return `${rounded}%`;
  if (/dollar|usd|\$/i.test(unit)) return `$${value.toFixed(2)}`;
  return `${rounded} ${unit}`;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// The strike this page's market is about, from the ticker suffix: "...-3.70" -> 3.7, "...-T4" -> 4.
function tickerStrike(ticker: string): number | null {
  const suffix = ticker.slice(ticker.lastIndexOf("-") + 1).replace(/^[A-Z]+/, "");
  const value = Number.parseFloat(suffix);
  return Number.isFinite(value) ? value : null;
}

// One row per Kalshi strike: the market's Yes price (ring) and the share of the panel's own
// estimates above that strike (dot) on the same 0–100% track.
export function StrikeLadder({ ticker, estimate, rungs }: { ticker: string; estimate: Estimate; rungs: LadderRung[] }) {
  const own = tickerStrike(ticker);
  // Rows where the market and the panel are both pinned near 0% or both near 100% say nothing,
  // so they are hidden (never this page's own strike) and counted below the ladder.
  const rows = rungs.map((rung) => ({
    rung,
    market: Math.round(rung.yesPercent),
    panel: Math.round(panelShareAbove(estimate.values, rung.strike)),
    isOwn: own !== null && Math.abs(rung.strike - own) < 1e-9,
  }));
  const pinned = (row: (typeof rows)[number]) =>
    !row.isOwn && ((row.market >= 98 && row.panel >= 98) || (row.market <= 2 && row.panel <= 2));
  const shown = rows.filter((row) => !pinned(row));
  const hidden = rows.length - shown.length;
  return (
    <section className="rounded-xl border border-line bg-card p-5 sm:p-6" data-testid="strike-ladder">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-base font-semibold text-ink">The whole strike ladder</h2>
        <p className="text-sm text-muted">
          Panel median estimate{" "}
          <span className="font-semibold tabular-nums text-panel">{formatValue(median(estimate.values), estimate.unit)}</span>{" "}
          from {estimate.values.length} answers
        </p>
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
        The panel was also asked for its own number: &ldquo;{estimate.question}&rdquo; Each row is one Kalshi
        strike. The ring is the market&apos;s Yes price; the dot is the share of panel estimates above that strike.
      </p>

      {rungs.length === 0 ? (
        <p className="mt-5 rounded-lg bg-bg p-4 text-sm text-ink">
          Kalshi&apos;s prices for the other strikes could not be loaded right now, so the ladder is hidden.
        </p>
      ) : (
        <ol className="mt-5 divide-y divide-line">
          {shown.map(({ rung, market, panel, isOwn }) => {
            // The panel dot sits over the market ring unless the two nearly coincide; then the
            // ring is drawn hollow on top so both stay visible.
            const close = Math.abs(panel - market) <= 2;
            const ring = (
              <span
                className={`absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-ink ${
                  close ? "bg-transparent" : "bg-card"
                }`}
                style={{ left: `${market}%` }}
              />
            );
            return (
              <li
                key={rung.strike}
                className={`grid grid-cols-[4.5rem_minmax(0,1fr)_5.5rem] items-center gap-3 py-2 text-sm sm:grid-cols-[6rem_minmax(0,1fr)_8rem] sm:gap-5 ${
                  isOwn ? "-mx-2 rounded-md bg-chip px-2" : ""
                }`}
              >
                <span className="tabular-nums text-ink">
                  <span className="text-muted max-sm:sr-only">Above </span>
                  <span className="font-semibold">{formatValue(rung.strike, estimate.unit)}</span>
                </span>
                <span className="relative h-5" aria-label={`Market ${market}% Yes, panel ${panel}% above`} role="img">
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-track" />
                  <span
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-panel-soft"
                    style={{ left: `${Math.min(market, panel)}%`, width: `${Math.abs(panel - market)}%` }}
                  />
                  {!close && ring}
                  <span
                    className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel"
                    style={{ left: `${panel}%` }}
                  />
                  {close && ring}
                </span>
                <span className="text-right tabular-nums">
                  <span className="font-semibold text-ink">{market}%</span>
                  <span className="text-muted"> · </span>
                  <span className="font-semibold text-panel">{panel}%</span>
                </span>
              </li>
            );
          })}
        </ol>
      )}
      <p className="mt-3 text-xs text-muted">
        Right column: Kalshi price · panel share. Highlighted row: this page&apos;s market.
        {hidden > 0
          ? ` ${hidden} ${hidden === 1 ? "strike" : "strikes"} where both are within 2 points of 0% or 100% ${hidden === 1 ? "is" : "are"} not shown.`
          : ""}{" "}
        Flashpoint survey{" "}
        <span className="break-all">{estimate.surveyId}</span>.
      </p>
    </section>
  );
}
