import { Disclosure } from "@/components/Disclosure";
import { GapCard } from "@/components/GapCard";
import { averageAbsoluteGap, gapPoints } from "@/lib/gap";
import { fetchMarketPrice } from "@/lib/kalshi";
import { loadRuns } from "@/lib/runs";

// Read the runs folder and the live Kalshi price on every request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const runs = await loadRuns();
  const prices = await Promise.all(runs.map((run) => fetchMarketPrice(run.ticker, run.marketAtRun)));
  const average = averageAbsoluteGap(runs.map((run, i) => gapPoints(run.yesShare, prices[i].yesPercent)));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">Street vs. Segment</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
        The market prices one thing. The people living it expect another.
      </h1>
      <p className="mt-4 max-w-3xl text-lg text-muted">
        Each card puts a live Kalshi prediction-market price next to a Flashpoint.AI panel of the
        people closest to the outcome, and shows the gap in percentage points.
      </p>

      {runs.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-line bg-card p-6 text-lg text-ink" data-testid="empty-state">
          The research panels are still running. Check back in a few minutes.
        </p>
      ) : (
        <>
          {average !== null && (
            <p className="mt-8 text-lg text-ink" data-testid="average-gap">
              Across {runs.length} markets, the segment and the market disagree by an average of{" "}
              <strong className="font-semibold">{average} points</strong>.
            </p>
          )}
          <div className="mt-6 flex flex-col gap-6">
            {runs.map((run, i) => (
              <GapCard key={run.ticker} run={run} price={prices[i]} />
            ))}
          </div>
        </>
      )}

      <footer className="mt-12 border-t border-line pt-6">
        <Disclosure />
      </footer>
    </main>
  );
}
