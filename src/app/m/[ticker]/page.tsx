import Link from "next/link";
import { notFound } from "next/navigation";
import { Breakdowns } from "@/components/Breakdowns";
import { Disclosure } from "@/components/Disclosure";
import { GapCard } from "@/components/GapCard";
import { KnownAnswerPanel } from "@/components/KnownAnswer";
import { SiteHeader } from "@/components/SiteHeader";
import { StrikeLadder } from "@/components/StrikeLadder";
import { formatTime } from "@/lib/format";
import { roundPercent } from "@/lib/gap";
import { fetchMarketPrice } from "@/lib/kalshi";
import { fetchStrikeLadder } from "@/lib/ladder";
import { loadRun } from "@/lib/runs";

export const dynamic = "force-dynamic";

const kindLabel = { yes_no: "The market's question", behavior: "What they do", open: "Why" } as const;

const panelClass = "rounded-xl border border-line bg-card p-5 sm:p-6";
const headingClass = "text-base font-semibold text-ink";
const kickerClass = "text-xs font-semibold text-panel";

export default async function MarketPage({ params }: PageProps<"/m/[ticker]">) {
  const { ticker } = await params;
  const run = await loadRun(decodeURIComponent(ticker));
  if (!run) notFound();
  const [price, rungs] = await Promise.all([
    fetchMarketPrice(run.ticker, run.marketAtRun),
    run.estimate ? fetchStrikeLadder(run.ticker) : Promise.resolve([]),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <SiteHeader>
        <span className="truncate font-mono text-xs text-muted">{run.ticker}</span>
      </SiteHeader>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        ← All markets
      </Link>

      <div className="mt-6">
        <GapCard run={run} price={price} linked={false} />
      </div>

      {run.estimate && (
        <div className="mt-10">
          <StrikeLadder ticker={run.ticker} estimate={run.estimate} rungs={rungs} />
        </div>
      )}

      {(run.breakdowns || run.knownAnswerCheck) && (
        <div className={`mt-4 grid grid-cols-1 gap-4 ${run.breakdowns && run.knownAnswerCheck ? "lg:grid-cols-2" : ""}`}>
          {run.breakdowns && <Breakdowns breakdowns={run.breakdowns} market={roundPercent(price.yesPercent)} />}
          {run.knownAnswerCheck && <KnownAnswerPanel check={run.knownAnswerCheck} />}
        </div>
      )}

      <div className={`${run.estimate || run.breakdowns || run.knownAnswerCheck ? "mt-4" : "mt-10"} grid grid-cols-1 gap-4 lg:grid-cols-3`}>
        <section className={panelClass} data-testid="panel-profile">
          <h2 className={headingClass}>Who was asked</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {run.panelSize} AI personas. The Census profile below ({run.segment.place}) describes the
            real population; only the panel&apos;s gender mix was matched to it.
            {typeof run.fitScore === "number" ? ` Flashpoint Fit Score ${run.fitScore}.` : ""}
          </p>
          <dl className="mt-4">
            {run.profile.map((stat) => (
              <div key={stat.label} className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-b-0">
                <dt className="text-muted">{stat.label}</dt>
                <dd className="text-right font-semibold tabular-nums text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={panelClass} data-testid="panel-questions">
          <h2 className={headingClass}>What we asked</h2>
          <ol className="mt-4 space-y-6">
            {run.questions.map((question) => (
              <li key={question.text} className="text-sm">
                <p className={kickerClass}>{kindLabel[question.kind]}</p>
                <p className="mt-1 font-medium leading-snug text-ink">{question.text}</p>
                {question.kind === "open" && !question.answers && (
                  <p className="mt-1 text-muted">Read the answers under &ldquo;In their words&rdquo;.</p>
                )}
                {question.answers && (
                  <ul className="mt-3 space-y-2.5">
                    {question.answers.map((answer) => (
                      <li key={answer.option}>
                        <span className="flex justify-between gap-3 text-muted">
                          <span>{answer.option}</span>
                          <span className="font-semibold tabular-nums text-ink">{Math.round(answer.percent)}%</span>
                        </span>
                        <span className="mt-1 block h-1.5 rounded-full bg-line">
                          <span
                            className="block h-1.5 rounded-full bg-panel"
                            style={{ width: `${Math.max(2, answer.percent)}%` }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className={panelClass} data-testid="panel-answers">
          <h2 className={headingClass}>What they said</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {Math.round(run.yesShare)}% answered Yes to the market&apos;s question.
          </p>
          <p className={`mt-5 ${kickerClass}`}>What they do</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{run.behaviorSummary}</p>
          <p className={`mt-5 ${kickerClass}`}>In their words</p>
          <ul className="mt-3 space-y-4">
            {run.quotes.map((quote) => (
              <li key={quote.text} className="border-l-2 border-panel-soft pl-3 text-sm" data-testid="quote">
                <p className="leading-relaxed text-ink">&ldquo;{quote.text}&rdquo;</p>
                <p className="mt-1 text-xs text-muted">{quote.persona}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="mt-12 max-w-3xl space-y-2 border-t border-line pt-6">
        <Disclosure full />
        <p className="break-all text-xs text-muted sm:break-normal">
          Flashpoint survey {run.flashpoint.surveyId}
          {run.flashpoint.panelId ? ` · panel ${run.flashpoint.panelId}` : ""} · run {formatTime(run.ranAt)} ·
          Kalshi market {run.ticker}
        </p>
      </footer>
    </main>
  );
}
