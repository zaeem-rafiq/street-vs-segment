# Street vs. Segment

A one-page web app that puts a live Kalshi prediction-market price next to a Flashpoint.AI synthetic panel of the people closest to the outcome, and shows the gap in percentage points. Built for the Hack the Unreachable hackathon on November 14, 2026.

## How it works

- `src/lib/kalshi.ts` reads the market's Yes price (last trade, else bid-ask midpoint, else the saved price) and the last trade time from Kalshi's public API. Read-only; it never trades. `KALSHI_BASE_URL` overrides the host for tests.
- `data/runs/<ticker>.json` holds one saved Flashpoint research run per market, validated by `src/lib/run-schema.ts`. Runs are made by Claude over Flashpoint's MCP server on the owner's signed-in account and saved by hand-off, never typed by hand. `docs/research-runbook.md` records what was asked.
- `RUNS_DIR` points the app at another runs folder. Only the browser tests set it (to `e2e/fixtures`); the public site never does. With no `RUNS_DIR`, `loadRuns()` also drops any run flagged `fixture`, so a fixture copied into `data/runs` stays off the public page (the data/runs unit test still fails on it).
- `src/lib/gap.ts` rounds both percentages to whole points, then subtracts (segment minus market).

## Commands

- `npm run dev` starts the app on port 3000.
- `./check` runs the secret scan, the feature-map check, lint, types, unit and property tests, the build, and the browser tests. The browser tests start two production servers on ports 3100 and 3101, so run `npm run build` first when running `npm run e2e` alone.

## Authorized Git and preview workflow

- Work on a task branch and commit verified units. Never commit to `main` directly.
- Pushing task branches to the private GitHub repository and opening pull requests is allowed without asking.
- Merging into `main`, publishing, making the repository public, or putting a link in front of real users needs the owner's approval.
- Never read, copy or log secrets. The owner enters them in the service's dashboard.

## Hackathon

- **Event:** Hack the Unreachable, an AI research hackathon powered by Flashpoint.AI. Judging by Flashpoint.AI, Pioneering Minds AI, and others. The brief was shared as a screenshot; no event web page or rubric was found.
- **Tracks:** Governance, Economic Signals, Self-Improving AI, News & Reporting, Investment Alpha. This entry targets Investment Alpha: "Find the gap between what's priced in and what key segments privately believe".
- **Schedule (Central time, November 14, 2026):** hacking from 11:00 AM; lunch at 1:00 PM; presentations and judging at 3:30 PM; winners at 4:30 PM.
- **Submission:** a public GitHub repository, plus a post about the build on LinkedIn or X. No separate deadline is stated, so the deadline is taken as 3:30 PM CT. Read from the brief at 10:45 AM CT.
- **Judging format:** live presentations at 3:30 PM. No judging criteria or weights were published.
- **Bonuses:** none listed.
- **Binding rules:** teams of up to 4; this entry is solo. New work only: the repository's first commit is dated after 11:00 AM CT on November 14, 2026.
- **Change cutoff:** 12:30 PM CT. After it the idea is frozen and the work is polish; a big change needs the owner's yes.
- **Midday check:** 1:00 PM CT. Code freeze: 3:00 PM CT.
- **Prizes:** $500, $200 and $100.
