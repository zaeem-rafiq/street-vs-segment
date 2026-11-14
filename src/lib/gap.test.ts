import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { averageAbsoluteGap, describeGap, formatGap, gapPoints, roundPercent } from "./gap";

const pct = fc.double({ min: 0, max: 100, noNaN: true });

describe("gapPoints", () => {
  it("stays between -100 and +100 for any two percentages", () => {
    fc.assert(
      fc.property(pct, pct, (segment, market) => {
        const gap = gapPoints(segment, market);
        return gap >= -100 && gap <= 100;
      }),
    );
  });

  it("flips sign when the two inputs swap", () => {
    fc.assert(
      fc.property(pct, pct, (a, b) => gapPoints(a, b) === -gapPoints(b, a) || (gapPoints(a, b) === 0 && gapPoints(b, a) === 0)),
    );
  });

  it("is zero when the inputs are equal", () => {
    fc.assert(fc.property(pct, (a) => gapPoints(a, a) === 0));
  });

  it("always equals the displayed segment minus the displayed market", () => {
    fc.assert(
      fc.property(pct, pct, (segment, market) => gapPoints(segment, market) === roundPercent(segment) - roundPercent(market)),
    );
  });

  it("computes a known example", () => {
    expect(gapPoints(38.4, 56.0)).toBe(-18);
  });
});

describe("averageAbsoluteGap", () => {
  it("averages the size of the gaps, ignoring their sign", () => {
    expect(averageAbsoluteGap([-18, 25, 1])).toBe(15);
  });

  it("returns null when there are no gaps", () => {
    expect(averageAbsoluteGap([])).toBeNull();
  });

  it("never exceeds the largest gap", () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1 }), (gaps) => {
        const average = averageAbsoluteGap(gaps) ?? 0;
        return average <= Math.max(...gaps.map(Math.abs));
      }),
    );
  });
});

describe("gap wording", () => {
  it("writes a signed gap with a real minus sign", () => {
    expect(formatGap(-18)).toBe("−18");
    expect(formatGap(7)).toBe("+7");
    expect(formatGap(0)).toBe("0");
  });

  it("names the direction of the gap", () => {
    expect(describeGap(-18, "NYC renters")).toBe("NYC renters lean No more than the market");
    expect(describeGap(5, "Drivers")).toBe("Drivers lean Yes more than the market");
    expect(describeGap(0, "Shoppers")).toBe("Shoppers agree with the market");
  });
});
