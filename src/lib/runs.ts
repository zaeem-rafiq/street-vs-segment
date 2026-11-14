import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseRun, type Run } from "./run-schema";

// RUNS_DIR lets the browser tests point at e2e/fixtures. The public site never sets it,
// so it only ever shows the real runs saved in data/runs.
export function runsDir(): string {
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.RUNS_DIR ?? "data/runs");
}

// The public site reads data/runs with no argument and no RUNS_DIR. That path drops any run
// flagged `fixture`, so a test fixture copied into data/runs can never show to visitors. An
// explicit dir or RUNS_DIR (the browser tests) keeps fixtures, and the data/runs unit test
// passes its dir explicitly so it still sees such a file and fails CI.
export async function loadRuns(dir?: string): Promise<Run[]> {
  const publicSite = dir === undefined && process.env.RUNS_DIR === undefined;
  const folder = dir ?? runsDir();
  let names: string[];
  try {
    names = await readdir(/*turbopackIgnore: true*/ folder);
  } catch {
    return [];
  }
  const files = names.filter((name) => name.endsWith(".json")).sort();
  const runs = await Promise.all(
    files.map(async (name) => {
      const text = await readFile(path.join(folder, name), "utf8");
      return parseRun(JSON.parse(text), name);
    }),
  );
  return publicSite ? runs.filter((run) => run.fixture !== true) : runs;
}

export async function loadRun(ticker: string): Promise<Run | undefined> {
  const runs = await loadRuns();
  return runs.find((run) => run.ticker === ticker);
}
