// A 0–100% scale with two dots: the market (hollow ring, label above the track) and the
// AI panel (filled, label below), joined by a bar whose length is the gap. Labels sit on
// opposite sides of the track so they never collide, and each is shifted by its own
// position (translateX(-x%)) so it stays inside the track at 0% and 100%.

type Props = { market: number; panel: number; size?: "md" | "lg" };

function Label({ at, children, className }: { at: number; children: React.ReactNode; className: string }) {
  return (
    <span
      className={`absolute whitespace-nowrap text-[13px] font-semibold tabular-nums sm:text-sm ${className}`}
      style={{ left: `${at}%`, transform: `translateX(-${at}%)` }}
    >
      {children}
    </span>
  );
}

export function Dumbbell({ market, panel, size = "md" }: Props) {
  const lo = Math.min(market, panel);
  const hi = Math.max(market, panel);
  const dot = size === "lg" ? "size-5" : "size-[18px]";
  // When the two dots nearly coincide, draw the ring hollow on top so both stay visible.
  const overlap = hi - lo <= 2;
  return (
    <div
      role="img"
      aria-label={`Kalshi market ${market}% Yes, AI panel ${panel}% Yes, on a scale from 0 to 100 percent`}
      className="flex items-center gap-3"
    >
      <span className="text-xs tabular-nums text-muted" aria-hidden>
        0
      </span>
      <div className={`relative flex-1 ${size === "lg" ? "h-20" : "h-[4.5rem]"}`}>
        <Label at={market} className="top-0 text-ink">
          Market <span data-testid="market-percent">{market}%</span>
        </Label>
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-track" />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-y-1/2 bg-track" />
        <div
          className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-panel-soft ${size === "lg" ? "h-2.5" : "h-2"}`}
          style={{ left: `${lo}%`, width: `${hi - lo}%` }}
        />
        <span
          className={`absolute top-1/2 ${dot} -translate-x-1/2 -translate-y-1/2 rounded-full bg-panel ring-2 ring-card`}
          style={{ left: `${panel}%` }}
        />
        <span
          className={`absolute top-1/2 ${dot} -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink ${
            overlap ? "scale-125 bg-transparent" : "bg-card"
          }`}
          style={{ left: `${market}%` }}
        />
        <Label at={panel} className="bottom-0 text-panel">
          AI panel <span data-testid="segment-percent">{panel}%</span>
        </Label>
      </div>
      <span className="text-xs tabular-nums text-muted" aria-hidden>
        100%
      </span>
    </div>
  );
}
