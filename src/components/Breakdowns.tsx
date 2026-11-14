import type { Run } from "@/lib/run-schema";

const dimensionLabel = { age: "By age", region: "By region", gender: "By gender" } as const;

// "Who drives the gap": each persona group's Yes share as a bar, with the Kalshi price drawn
// as a black tick on every bar so groups above and below the market read at a glance.
export function Breakdowns({ breakdowns, market }: { breakdowns: NonNullable<Run["breakdowns"]>; market: number }) {
  return (
    <section className="rounded-xl border border-line bg-card p-5 sm:p-6" data-testid="breakdowns">
      <h2 className="text-base font-semibold text-ink">Who drives the gap</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Each bar is one group&apos;s share saying Yes. The black tick is the Kalshi price, {market}%.
      </p>
      <div className="mt-5 space-y-6">
        {breakdowns.map((breakdown) => (
          <div key={breakdown.dimension}>
            <h3 className="text-xs font-semibold text-panel">{dimensionLabel[breakdown.dimension]}</h3>
            <ul className="mt-3 space-y-3">
              {breakdown.groups.map((group) => {
                const share = Math.round(group.yesShare);
                return (
                  <li key={group.label} className="text-sm">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-ink">
                        {group.label} <span className="text-xs text-muted">n={group.n}</span>
                      </span>
                      <span className="font-semibold tabular-nums text-ink">{share}%</span>
                    </span>
                    <span className="relative mt-1.5 block h-2 rounded-full bg-line" aria-hidden>
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-panel"
                        style={{ width: `${Math.max(1, share)}%` }}
                      />
                      <span
                        className="absolute -top-1 h-4 w-0.5 bg-ink"
                        style={{ left: `${market}%`, transform: `translateX(-${market}%)` }}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
