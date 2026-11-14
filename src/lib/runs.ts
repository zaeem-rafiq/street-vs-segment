import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseRun, type Run } from "./run-schema";

// RUNS_DIR lets the browser tests point at e2e/fixtures. The public site never sets it,
// so it only ever shows the real runs saved in data/runs.
export function runsDir(): string {
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.RUNS_DIR ?? "data/runs");
}

export async function loadRuns(dir: string = runsDir()): Promise<Run[]> {
  let names: string[];
  try {
    names = await readdir(/*turbopackIgnore: true*/ dir);
  } catch {
    return [];
  }
  const files = names.filter((name) => name.endsWith(".json")).sort();
  return Promise.all(
    files.map(async (name) => {
      const text = await readFile(path.join(dir, name), "utf8");
      return parseRun(JSON.parse(text), name);
    }),
  );
}

export async function loadRun(ticker: string): Promise<Run | undefined> {
  const runs = await loadRuns();
  return runs.find((run) => run.ticker === ticker);
}
