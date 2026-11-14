import { Disclosure } from "@/components/Disclosure";
import { GapCard } from "@/components/GapCard";
import { PriceStatus, SiteHeader } from "@/components/SiteHeader";
import { averageAbsoluteGap, gapPoints } from "@/lib/gap";
import { fetchMarketPrice } from "@/lib/kalshi";
import { loadRuns } from "@/lib/runs";

// Read the runs folder and the live Kalshi price on every request.
export const dynamic = "force-dynamic";

function LegendDot({ kind }: { kind: "market" | "panel" }) {
  return kind === "market" ? (
    <span className="size-3 rounded-full border-[2.5px] border-ink bg-card" aria-hidden />
  ) : (
    <span className="size-3 rounded-full bg-panel" aria-hidden />
  );
}

export default async function Home() {
  const runs = await loadRuns();
  const prices = await Promise.all(runs.map((run) => fetchMarketPrice(run.ticker, run.marketAtRun)));
  const average = averageAbsoluteGap(runs.map((run, i) => gapPoints(run.yesShare, prices[i].yesPercent)));
  const allLive = prices.every((price) => price.source === "live");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <SiteHeader>{prices.length > 0 && <PriceStatus live={allLive} />}</SiteHeader>

      <section className="pt-10 sm:pt-16">
        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          The market prices one thing. An AI panel of the people living it expects another.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Kalshi lists 945 economics market series, each priced only by the people who trade it. Each
          row puts {allLive ? "a live" : "a"} Kalshi price next to a Flashpoint.AI synthetic panel of 100 personas modeled
          on the people closest to the outcome, and shows the gap in percentage points.
        </p>
      </section>

      {runs.length === 0 ? (
        <p className="mt-10 rounded-xl border border-line bg-card p-6 text-lg text-ink" data-testid="empty-state">
          The research panels are still running. Check back in a few minutes.
        </p>
      ) : (
        <>
          <div className="mt-10 flex flex-col gap-4 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
            {average !== null && (
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ink" data-testid="average-gap">
                <span className="text-sm text-muted">Across {runs.length} markets, the panel and the market differ by an average of</span>
                <strong className="text-4xl font-bold tracking-tight tabular-nums">
                  {average} {average === 1 ? "point" : "points"}
                </strong>
              </p>
            )}
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-ink">
              <li className="flex items-center gap-2">
                <LegendDot kind="market" /> Kalshi market price
              </li>
              <li className="flex items-center gap-2">
                <LegendDot kind="panel" /> AI panel, share saying Yes
              </li>
            </ul>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            {runs.map((run, i) => (
              <GapCard key={run.ticker} run={run} price={prices[i]} />
            ))}
          </div>
        </>
      )}

      <footer className="mt-12 max-w-3xl border-t border-line pt-6">
        <Disclosure />
      </footer>
    </main>
  );
}
