// The strike ladder: Kalshi's Yes price at every strike of one market family, next to the share
// of the panel's own estimates that land above each strike. Read-only; nothing trades.
import { dollarsToPercent } from "./kalshi";

export type LadderRung = { strike: number; yesPercent: number };

type KalshiStrikeMarket = {
  floor_strike?: number | null;
  strike_type?: string | null;
  last_price_dollars?: string | null;
  yes_bid_dollars?: string | null;
  yes_ask_dollars?: string | null;
};

const CACHE_MS = 60_000;
const TIMEOUT_MS = 4_000;
const cache = new Map<string, { at: number; rungs: LadderRung[] }>();

function baseUrl(): string {
  return process.env.KALSHI_BASE_URL ?? "https://api.elections.kalshi.com/trade-api/v2";
}

// "KXAAAGASM-26NOV30-3.70" -> "KXAAAGASM-26NOV30": Kalshi's market ticker is the event ticker
// plus one strike suffix.
export function eventTickerOf(ticker: string): string {
  const cut = ticker.lastIndexOf("-");
  return cut > 0 ? ticker.slice(0, cut) : ticker;
}

// Only "greater than" strikes with a real price: the last trade, else a two-sided quote.
export function rungsFromMarkets(markets: KalshiStrikeMarket[]): LadderRung[] {
  const rungs: LadderRung[] = [];
  for (const market of markets) {
    if (market.strike_type !== "greater" || typeof market.floor_strike !== "number") continue;
    const last = dollarsToPercent(market.last_price_dollars);
    const bid = dollarsToPercent(market.yes_bid_dollars);
    const ask = dollarsToPercent(market.yes_ask_dollars);
    let yesPercent: number | null = null;
    if (last !== null && last > 0) yesPercent = last;
    else if (bid !== null && ask !== null && bid > 0 && ask < 100 && ask >= bid) yesPercent = (bid + ask) / 2;
    if (yesPercent !== null) rungs.push({ strike: market.floor_strike, yesPercent });
  }
  return rungs.sort((a, b) => a.strike - b.strike);
}

export async function fetchStrikeLadder(ticker: string): Promise<LadderRung[]> {
  const event = eventTickerOf(ticker);
  const hit = cache.get(event);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.rungs;
  try {
    const response = await fetch(`${baseUrl()}/markets?event_ticker=${encodeURIComponent(event)}&limit=100`, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return [];
    const body = (await response.json()) as { markets?: KalshiStrikeMarket[] };
    const rungs = rungsFromMarkets(body.markets ?? []);
    cache.set(event, { at: Date.now(), rungs });
    return rungs;
  } catch {
    return [];
  }
}

// Share of panel estimates strictly above the strike, in percent (Kalshi's "greater" rule).
export function panelShareAbove(values: number[], strike: number): number {
  if (values.length === 0) return 0;
  const above = values.filter((value) => value > strike).length;
  return (above / values.length) * 100;
}

export function clearLadderCache(): void {
  cache.clear();
}
