export function Disclosure({ full = false }: { full?: boolean }) {
  return (
    <p className="text-sm leading-relaxed text-muted" data-testid="disclosure">
      Segment figures come from Flashpoint.AI synthetic panels: 100 AI personas per market, not
      live human respondents. Only their gender mix was matched to Census data; the Census
      profile describes the real population.
      {full
        ? " The quotes are verbatim persona answers, five chosen from 100. Real respondents are one Flashpoint call away; this demo leaves them out for budget. "
        : " "}
      Market prices are read from Kalshi&apos;s public data. Nothing on this page trades.
    </p>
  );
}
