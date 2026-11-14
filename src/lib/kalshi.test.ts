import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearPriceCache, dollarsToPercent, fetchMarketPrice, priceFromMarket } from "./kalshi";

const saved = { yesPercent: 50, time: "2026-11-14T17:00:00Z" };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("priceFromMarket", () => {
  it("parses Kalshi's dollar strings into percent", () => {
    expect(dollarsToPercent("0.5600")).toBeCloseTo(56);
    expect(dollarsToPercent(null)).toBeNull();
    expect(dollarsToPercent("abc")).toBeNull();
  });

  it("uses the last trade price when there is one", () => {
    const price = priceFromMarket({ last_price_dollars: "0.5600", yes_bid_dollars: "0.5400", yes_ask_dollars: "0.9600" });
    expect(price.yesPercent).toBeCloseTo(56);
    expect(price.spreadPoints).toBe(42);
  });

  it("falls back to the bid-ask midpoint when there is no last trade", () => {
    const price = priceFromMarket({ last_price_dollars: "0.0000", yes_bid_dollars: "0.4000", yes_ask_dollars: "0.5000" });
    expect(price.yesPercent).toBeCloseTo(45);
  });

  it("returns no price when every field is missing", () => {
    expect(priceFromMarket({}).yesPercent).toBeNull();
  });
});

describe("fetchMarketPrice", () => {
  beforeEach(() => clearPriceCache());
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("returns the live price and the last trade time", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("/trades")
          ? jsonResponse({ trades: [{ created_time: "2026-11-12T10:00:00Z" }] })
          : jsonResponse({ market: { last_price_dollars: "0.5600" } }),
      ),
    );
    const price = await fetchMarketPrice("ABC", saved);
    expect(price.source).toBe("live");
    expect(price.yesPercent).toBeCloseTo(56);
    expect(price.lastTradeTime).toBe("2026-11-12T10:00:00Z");
  });

  it("returns the saved price when Kalshi answers with an error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ error: "nope" }, 404)));
    const price = await fetchMarketPrice("ABC", saved);
    expect(price).toMatchObject({ source: "saved", yesPercent: 50, lastTradeTime: saved.time });
  });

  it("returns the saved price when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const price = await fetchMarketPrice("ABC", saved);
    expect(price.source).toBe("saved");
  });

  it("keeps the live price when only the trades call fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        url.includes("/trades") ? jsonResponse({}, 500) : jsonResponse({ market: { last_price_dollars: "0.3000" } }),
      ),
    );
    const price = await fetchMarketPrice("ABC", saved);
    expect(price.source).toBe("live");
    expect(price.lastTradeTime).toBeNull();
  });

  it("remembers a failure for 15 seconds, still labeled as the saved price", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const fetchStub = vi.fn(async () => {
      throw new Error("offline");
    });
    vi.stubGlobal("fetch", fetchStub);

    const first = await fetchMarketPrice("ABC", saved);
    const callsAfterFirst = fetchStub.mock.calls.length;
    expect(first).toMatchObject({ source: "saved", yesPercent: 50, lastTradeTime: saved.time });

    vi.setSystemTime(Date.now() + 14_000);
    const second = await fetchMarketPrice("ABC", saved);
    expect(second.source).toBe("saved");
    expect(fetchStub.mock.calls.length).toBe(callsAfterFirst);

    vi.setSystemTime(Date.now() + 2_000);
    await fetchMarketPrice("ABC", saved);
    expect(fetchStub.mock.calls.length).toBeGreaterThan(callsAfterFirst);
  });

  it("shares one pair of Kalshi calls between requests that arrive together", async () => {
    const fetchStub = vi.fn(async (url: string) =>
      url.includes("/trades")
        ? jsonResponse({ trades: [{ created_time: "2026-11-12T10:00:00Z" }] })
        : jsonResponse({ market: { last_price_dollars: "0.5600" } }),
    );
    vi.stubGlobal("fetch", fetchStub);

    const [a, b, c] = await Promise.all([
      fetchMarketPrice("ABC", saved),
      fetchMarketPrice("ABC", saved),
      fetchMarketPrice("ABC", saved),
    ]);
    expect(fetchStub).toHaveBeenCalledTimes(2);
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  it("keeps a live price for 60 seconds and then asks Kalshi again", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const fetchStub = vi.fn(async (url: string) =>
      url.includes("/trades") ? jsonResponse({ trades: [] }) : jsonResponse({ market: { last_price_dollars: "0.5600" } }),
    );
    vi.stubGlobal("fetch", fetchStub);

    await fetchMarketPrice("ABC", saved);
    expect(fetchStub).toHaveBeenCalledTimes(2);

    vi.setSystemTime(Date.now() + 59_000);
    await fetchMarketPrice("ABC", saved);
    expect(fetchStub).toHaveBeenCalledTimes(2);

    vi.setSystemTime(Date.now() + 2_000);
    await fetchMarketPrice("ABC", saved);
    expect(fetchStub).toHaveBeenCalledTimes(4);
  });
});
