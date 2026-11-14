import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRuns } from "./runs";
import { parseRun } from "./run-schema";

const fixture = JSON.parse(
  readFileSync(path.resolve(__dirname, "../../e2e/fixtures/fixture-rent.json"), "utf8"),
);

describe("run schema", () => {
  it("accepts the test fixture", () => {
    expect(parseRun(fixture, "fixture").ticker).toBe("KXNYCRENTSY-26-T4");
  });

  it("rejects a run with no Yes share", () => {
    const { yesShare: _omit, ...rest } = fixture;
    void _omit;
    expect(() => parseRun(rest, "bad")).toThrow(/not a valid run file/);
  });

  it("rejects a Yes share outside 0 to 100", () => {
    expect(() => parseRun({ ...fixture, yesShare: 140 }, "bad")).toThrow();
  });

  it("rejects a run with fewer than three quotes", () => {
    expect(() => parseRun({ ...fixture, quotes: fixture.quotes.slice(0, 2) }, "bad")).toThrow();
  });
});

describe("saved research runs", () => {
  it("every file in data/runs is a valid real run, not a fixture", async () => {
    const runs = await loadRuns(path.resolve(__dirname, "../../data/runs"));
    for (const run of runs) {
      expect(run.fixture).not.toBe(true);
    }
  });
});
