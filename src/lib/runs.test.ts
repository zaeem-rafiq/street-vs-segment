import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadRun, loadRuns } from "./runs";

const fixture = JSON.parse(
  readFileSync(path.resolve(__dirname, "../../e2e/fixtures/fixture-rent.json"), "utf8"),
);
const realRun = { ...fixture, ticker: "REAL-1", fixture: undefined };

describe("loadRuns fixture guard", () => {
  let root: string;
  let runsFolder: string;
  let savedRunsDir: string | undefined;

  beforeEach(() => {
    // A throwaway working folder that holds a data/runs with one real run and one fixture.
    root = mkdtempSync(path.join(os.tmpdir(), "runs-guard-"));
    runsFolder = path.join(root, "data", "runs");
    mkdirSync(runsFolder, { recursive: true });
    writeFileSync(path.join(runsFolder, "real.json"), JSON.stringify(realRun));
    writeFileSync(path.join(runsFolder, "fixture.json"), JSON.stringify(fixture));
    savedRunsDir = process.env.RUNS_DIR;
    delete process.env.RUNS_DIR;
    vi.spyOn(process, "cwd").mockReturnValue(root);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (savedRunsDir === undefined) delete process.env.RUNS_DIR;
    else process.env.RUNS_DIR = savedRunsDir;
    rmSync(root, { recursive: true, force: true });
  });

  it("hides fixture runs on the public read path (no dir, no RUNS_DIR)", async () => {
    const tickers = (await loadRuns()).map((run) => run.ticker);
    expect(tickers).toEqual(["REAL-1"]);
    expect(await loadRun(fixture.ticker)).toBeUndefined();
  });

  it("keeps fixture runs when the browser tests set RUNS_DIR", async () => {
    process.env.RUNS_DIR = "data/runs";
    const tickers = (await loadRuns()).map((run) => run.ticker).sort();
    expect(tickers).toEqual([fixture.ticker, "REAL-1"].sort());
  });

  it("keeps fixture runs when a dir is passed, so the data/runs guard test can see them", async () => {
    const runs = await loadRuns(runsFolder);
    expect(runs.some((run) => run.fixture === true)).toBe(true);
  });
});
