// Reads a market's Yes price from Kalshi's public API. Read-only: nothing here can trade.

export type MarketPrice = {
  yesPercent: number;
  source: "live" | "saved";
  lastTradeTime: string | null;
  spreadPoints: number | null;
};

type KalshiMarket = {
  last_price_dollars?: string | null;
  yes_bid_dollars?: string | null;
  yes_ask_dollars?: string | null;
};

const CACHE_MS = 60_000;
const TIMEOUT_MS = 4_000;
const cache = new Map<string, { at: number; price: MarketPrice }>();

function baseUrl(): string {
  return process.env.KALSHI_BASE_URL ?? "https://api.elections.kalshi.com/trade-api/v2";
}

export function dollarsToPercent(value: string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return number * 100;
}

// Last trade first. A thin book can have a bid of 54 and an ask of 96, so the midpoint is
// only a fallback, and the spread is returned so the card can show how thin the book is.
export function priceFromMarket(market: KalshiMarket): {
  yesPercent: number | null;
  spreadPoints: number | null;
} {
  const last = dollarsToPercent(market.last_price_dollars);
  const bid = dollarsToPercent(market.yes_bid_dollars);
  const ask = dollarsToPercent(market.yes_ask_dollars);
  const spreadPoints = bid !== null && ask !== null ? Math.round(ask - bid) : null;
  if (last !== null && last > 0) return { yesPercent: last, spreadPoints };
  if (bid !== null && ask !== null) return { yesPercent: (bid + ask) / 2, spreadPoints };
  return { yesPercent: null, spreadPoints };
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Kalshi returned ${response.status}`);
  return response.json();
}

export async function fetchMarketPrice(
  ticker: string,
  saved: { yesPercent: number; time: string },
): Promise<MarketPrice> {
  const hit = cache.get(ticker);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.price;

  const savedPrice: MarketPrice = {
    yesPercent: saved.yesPercent,
    source: "saved",
    lastTradeTime: saved.time,
    spreadPoints: null,
  };

  try {
    const encoded = encodeURIComponent(ticker);
    const [marketBody, tradesBody] = await Promise.all([
      getJson(`${baseUrl()}/markets/${encoded}`),
      getJson(`${baseUrl()}/markets/trades?ticker=${encoded}&limit=1`).catch(() => null),
    ]);
    const market = (marketBody as { market?: KalshiMarket }).market;
    if (!market) return savedPrice;
    const { yesPercent, spreadPoints } = priceFromMarket(market);
    if (yesPercent === null) return savedPrice;
    const trades = (tradesBody as { trades?: { created_time?: string }[] } | null)?.trades;
    const price: MarketPrice = {
      yesPercent,
      source: "live",
      lastTradeTime: trades?.[0]?.created_time ?? null,
      spreadPoints,
    };
    cache.set(ticker, { at: Date.now(), price });
    return price;
  } catch {
    return savedPrice;
  }
}

export function clearPriceCache(): void {
  cache.clear();
}
