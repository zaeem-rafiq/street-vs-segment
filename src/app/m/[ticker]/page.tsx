import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclosure } from "@/components/Disclosure";
import { GapCard } from "@/components/GapCard";
import { formatTime } from "@/lib/format";
import { fetchMarketPrice } from "@/lib/kalshi";
import { loadRun } from "@/lib/runs";

export const dynamic = "force-dynamic";

const kindLabel = { yes_no: "The market's question", behavior: "What they do", open: "Why" } as const;

export default async function MarketPage({ params }: PageProps<"/m/[ticker]">) {
  const { ticker } = await params;
  const run = await loadRun(decodeURIComponent(ticker));
  if (!run) notFound();
  const price = await fetchMarketPrice(run.ticker, run.marketAtRun);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="text-sm font-medium text-accent">
        ← All markets
      </Link>
      <div className="mt-4">
        <GapCard run={run} price={price} linked={false} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-card p-5" data-testid="panel-profile">
          <h2 className="text-lg font-semibold text-ink">Who was asked</h2>
          <p className="mt-1 text-sm text-muted">
            {run.panelSize} AI personas. The Census profile below describes the real population of{" "}
            {run.segment.place}; only the panel&apos;s gender mix was matched to it.
            {typeof run.fitScore === "number" ? ` Flashpoint Fit Score ${run.fitScore}.` : ""}
          </p>
          <dl className="mt-4 space-y-2">
            {run.profile.map((stat) => (
              <div key={stat.label} className="flex justify-between gap-4 border-b border-line pb-2 text-sm">
                <dt className="text-muted">{stat.label}</dt>
                <dd className="text-right font-medium text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-card p-5" data-testid="panel-questions">
          <h2 className="text-lg font-semibold text-ink">What we asked</h2>
          <ol className="mt-4 space-y-4">
            {run.questions.map((question) => (
              <li key={question.text} className="text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{kindLabel[question.kind]}</p>
                <p className="mt-1 text-ink">{question.text}</p>
                {question.answers && (
                  <ul className="mt-2 space-y-1">
                    {question.answers.map((answer) => (
                      <li key={answer.option} className="flex items-center gap-2">
                        <span className="w-24 shrink-0 truncate text-muted">{answer.option}</span>
                        <span className="h-2 rounded bg-accent" style={{ width: `${Math.max(2, answer.percent)}%` }} />
                        <span className="tabular-nums text-ink">{Math.round(answer.percent)}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-line bg-card p-5" data-testid="panel-answers">
          <h2 className="text-lg font-semibold text-ink">What they said</h2>
          <p className="mt-1 text-sm text-muted">{Math.round(run.yesShare)}% answered Yes to the market&apos;s question.</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">What they do</p>
          <p className="mt-1 text-sm text-ink">{run.behaviorSummary}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">In their words</p>
          <ul className="mt-2 space-y-3">
            {run.quotes.map((quote) => (
              <li key={quote.text} className="text-sm" data-testid="quote">
                <p className="text-ink">&ldquo;{quote.text}&rdquo;</p>
                <p className="mt-0.5 text-xs text-muted">{quote.persona}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="mt-10 space-y-2 border-t border-line pt-6">
        <Disclosure full />
        <p className="text-xs text-muted">
          Flashpoint survey {run.flashpoint.surveyId}
          {run.flashpoint.panelId ? ` · panel ${run.flashpoint.panelId}` : ""} · run {formatTime(run.ranAt)} ·
          Kalshi market {run.ticker}
        </p>
      </footer>
    </main>
  );
}
