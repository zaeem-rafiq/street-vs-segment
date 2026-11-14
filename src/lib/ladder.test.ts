import fc from "fast-check";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearLadderCache, eventTickerOf, fetchStrikeLadder, panelShareAbove, rungsFromMarkets } from "./ladder";

describe("eventTickerOf", () => {
  it("drops the strike suffix from a market ticker", () => {
    expect(eventTickerOf("KXAAAGASM-26NOV30-3.70")).toBe("KXAAAGASM-26NOV30");
    expect(eventTickerOf("KXNYCRENTSY-26-T4")).toBe("KXNYCRENTSY-26");
  });
});

describe("rungsFromMarkets", () => {
  it("keeps greater-than strikes with a price, sorted by strike", () => {
    const rungs = rungsFromMarkets([
      { floor_strike: 3.8, strike_type: "greater", last_price_dollars: "0.2000" },
      { floor_strike: 3.6, strike_type: "greater", last_price_dollars: "0.7000" },
      { floor_strike: 3.7, strike_type: "less", last_price_dollars: "0.5000" },
    ]);
    expect(rungs.map((r) => r.strike)).toEqual([3.6, 3.8]);
    expect(rungs[0].yesPercent).toBeCloseTo(70);
  });

  it("skips a strike with no trade and a one-sided book", () => {
    const rungs = rungsFromMarkets([
      { floor_strike: 5, strike_type: "greater", last_price_dollars: "0.0000", yes_bid_dollars: "0.0000", yes_ask_dollars: "1.0000" },
    ]);
    expect(rungs).toEqual([]);
  });

  it("uses a real two-sided quote when there is no trade", () => {
    const rungs = rungsFromMarkets([
      { floor_strike: 4, strike_type: "greater", last_price_dollars: "0.0000", yes_bid_dollars: "0.3000", yes_ask_dollars: "0.4000" },
    ]);
    expect(rungs[0].yesPercent).toBeCloseTo(35);
  });
});

describe("panelShareAbove", () => {
  it("counts estimates strictly above the strike", () => {
    expect(panelShareAbove([3.5, 3.7, 3.8, 3.9], 3.7)).toBe(50);
  });

  it("never rises as the strike rises", () => {
    fc.assert(
      fc.property(fc.array(fc.double({ min: 0, max: 10, noNaN: true }), { minLength: 1 }), fc.double({ min: 0, max: 10, noNaN: true }), fc.double({ min: 0, max: 5, noNaN: true }), (values, strike, step) =>
        panelShareAbove(values, strike + step) <= panelShareAbove(values, strike),
      ),
    );
  });

  it("is 0 for no estimates", () => {
    expect(panelShareAbove([], 3)).toBe(0);
  });
});

describe("fetchStrikeLadder", () => {
  beforeEach(() => clearLadderCache());
  afterEach(() => vi.unstubAllGlobals());

  it("asks Kalshi for the whole event and returns its rungs", async () => {
    const fetchStub = vi.fn(async (_url: string) =>
      new Response(JSON.stringify({ markets: [{ floor_strike: 3.7, strike_type: "greater", last_price_dollars: "0.3400" }] })),
    );
    vi.stubGlobal("fetch", fetchStub);
    const rungs = await fetchStrikeLadder("KXAAAGASM-26NOV30-3.70");
    expect(String(fetchStub.mock.calls[0][0])).toContain("event_ticker=KXAAAGASM-26NOV30");
    expect(rungs).toEqual([{ strike: 3.7, yesPercent: 34 }]);
  });

  it("returns no rungs when Kalshi fails, so the chart is simply left out", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    expect(await fetchStrikeLadder("ABC-1")).toEqual([]);
  });
});
