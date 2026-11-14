import type { Run } from "@/lib/run-schema";

type Check = NonNullable<Run["knownAnswerCheck"]>;

// How far the panel's Yes share landed from the known truth (0% Yes for a No, 100% for a Yes).
export function missPoints(check: Check): number {
  const share = Math.round(check.panelYesShare);
  return check.correctAnswer === "Yes" ? 100 - share : share;
}

function SourceLink({ check }: { check: Check }) {
  return (
    <a
      href={check.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-ink underline underline-offset-4 hover:text-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {check.sourceName}
    </a>
  );
}

const fact = (check: Check) => check.fact.trim().replace(/\.$/, "");

// One line under a home-page card. The fact itself is a full sentence, so it stays on the
// market page; the card says how far the panel landed from the known answer.
export function KnownAnswerLine({ check }: { check: Check }) {
  const miss = missPoints(check);
  return (
    <p className="text-sm text-muted" data-testid="known-answer">
      <span className="font-semibold text-ink">Known-answer check:</span> On a question whose answer is known
      to be {check.correctAnswer}, {Math.round(check.panelYesShare)}% of this panel said Yes,{" "}
      <span className="font-semibold text-ink">
        {miss} {miss === 1 ? "point" : "points"} from the truth
      </span>
      . Source: <SourceLink check={check} />
    </p>
  );
}

// The full check on the market page.
export function KnownAnswerPanel({ check }: { check: Check }) {
  const share = Math.round(check.panelYesShare);
  const truth = check.correctAnswer === "Yes" ? 100 : 0;
  const miss = missPoints(check);
  return (
    <section className="rounded-xl border border-line bg-card p-5 sm:p-6" data-testid="known-answer">
      <h2 className="text-base font-semibold text-ink">Known-answer check</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The same panel answered a question whose answer is already public, to show how far it can
        be from the truth.
      </p>
      <p className="mt-4 text-xs font-semibold text-panel">The question</p>
      <p className="mt-1 text-sm font-medium leading-snug text-ink">{check.question}</p>
      <p className="mt-4 text-xs font-semibold text-panel">The known answer: {check.correctAnswer}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink">
        {fact(check)}. Source: <SourceLink check={check} />
      </p>
      <div className="mt-5">
        <div className="relative h-2 rounded-full bg-line" aria-hidden>
          <span className="absolute inset-y-0 left-0 rounded-full bg-panel" style={{ width: `${Math.max(1, share)}%` }} />
          <span
            className="absolute -top-1 h-4 w-0.5 bg-ink"
            style={{ left: `${truth}%`, transform: `translateX(-${truth}%)` }}
          />
        </div>
        <p className="mt-2 text-sm text-ink">
          <span className="font-semibold tabular-nums text-panel">{share}%</span> of the panel said Yes. The
          truth is {truth}% Yes, so the panel missed by{" "}
          <span className="font-semibold tabular-nums">
            {miss} {miss === 1 ? "point" : "points"}
          </span>
          .
        </p>
      </div>
      <p className="mt-4 break-all text-xs text-muted sm:break-normal">Flashpoint survey {check.surveyId}</p>
    </section>
  );
}
