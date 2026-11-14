export function Disclosure({ full = false }: { full?: boolean }) {
  return (
    <p className="text-sm leading-relaxed text-muted" data-testid="disclosure">
      Segment figures come from Flashpoint.AI synthetic panels: AI personas built to match each
      place&apos;s Census profile, not live human respondents.
      {full
        ? " Real respondents are one Flashpoint call away; this demo leaves them out for budget. "
        : " "}
      Market prices are read from Kalshi&apos;s public data. Nothing on this page trades.
    </p>
  );
}
