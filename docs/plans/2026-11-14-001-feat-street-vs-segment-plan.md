---
title: Street vs. Segment — hackathon build
date: 2026-11-14
type: feat
status: active
depth: standard
product_contract_source: ce-plan-bootstrap
origin: brief.md
---

# Street vs. Segment — hackathon build

## Goal Capsule

- **Objective:** By 3:30 PM CT on November 14, 2026, judges at Hack the Unreachable see one public page where a live Kalshi market price sits next to a Flashpoint panel of the people closest to the outcome, with the gap as one big number.
- **Means:** A Next.js page that reads live Kalshi prices and shows saved Flashpoint research runs. The runs are made by Claude over Flashpoint's MCP server on the owner's signed-in account.
- **Hard stops:** change cutoff 12:30 PM, public link by 1:00 PM, code freeze 3:00 PM.
- **Done when:** the public link shows one gap card per real saved run (three, or two with the third noted as late), `./check` passes, and the demo script runs in 2 minutes.

## Product Contract

### Summary

Judges need to see, in one screen, that a prediction market and the people living the outcome disagree, and that an agent found the gap by asking those people through Flashpoint. The page shows three ready examples. Each has a gap card, then the segment's Census profile, the questions Flashpoint wrote, and the answers. There is no trading, no user accounts, no paid real respondents and no live "run a new market" button.

### Problem Frame

Markets show what is priced in. They do not show what the people closest to an outcome privately expect or are already doing. The event asks for agents that "uncover what people actually think and turn it into something useful" (event brief, Investment Alpha track: "Find the gap between what's priced in and what key segments privately believe").

### Requirements

- R1. The home page opens with one plain sentence stating the idea, then one gap card per saved run (three planned), then one line with the average gap across the cards. Each card shows the market question, the market's Yes price in percent with its last-trade time, the segment's Yes share in percent labeled with the segment's name (for example "NYC renters"), and the gap as a signed number with a direction phrase (for example "−26 points: renters are below the market"), largest type on the page.
- R2. Market prices are read live from Kalshi's public API on page load, with at most 60 seconds of caching. If Kalshi fails, the card shows the price saved with the run, labeled "saved price, <time>".
- R3. Each card opens a detail view with three panels: the segment's Census profile (Flashpoint `demographics`), the survey questions (Flashpoint `tool_survey`), and the answers with 3 to 5 quotes (Flashpoint `panel create_and_run`).
- R4. Every panel number on screen comes from a saved Flashpoint run file in the repository. Nothing is hand-typed.
- R5. The page states plainly that panels are AI personas checked against Census data: each card's segment figure carries an "AI panel" label, the home page footer carries a one-line disclosure, and the detail view shows the full disclosure and Flashpoint's Fit Score when the run returned one.
- R6. The page needs no login and works at 375, 768 and 1440 pixels wide.
- R7. Nothing on the page trades, and no secret ships in the repository.

### Success Criteria

- A fresh reader of the first screen can say what the product does in one sentence (30-second judge test, run by a fresh helper agent at the midday audit).
- Each gap is computed from a real saved run and the market price shown on the same card, with that price's time, so the arithmetic is checkable on screen.

### Scope Boundaries

- Out: trading or any order flow; user accounts; paid real respondents (Prolific, Dynata, Cint); a live "run a new market" button; the event wallet; LinkedIn or X posting by Claude.
- Deferred until after the event: Dependabot, branch protection and the standard hookify rules (owner confirmed the trim on November 14, 2026).

### Key Decisions

- KD1. Street vs. Segment is the entry (session-settled: user-directed — chosen over Claim Check, ZIP Pulse, Gap Hunter and Budget Ballot: highest score against the brief's own phrases).
- KD2. Flashpoint is reached through the owner's own sign-in over MCP (session-settled: user-directed — chosen over the event's $20 USDC wallet: Claude may not sign crypto payments, and signed-in calls are covered by the account).
- KD3. Research runs happen in a Claude Code session and are saved as files; the web page shows saved runs with live prices (session-settled: user-approved — chosen over a live run button: the sign-in token lasts 24 hours and cannot live on a public server).

## Planning Contract

### Key Technical Decisions

- KTD1. Next.js (App Router) with TypeScript and Tailwind, hosted on Render as a free web service. Factory default; a server component can fetch Kalshi without exposing anything to the browser.
- KTD2. Market price = `last_price_dollars`; if missing, the midpoint of `yes_bid_dollars` and `yes_ask_dollars`; if both missing, the saved price. Last-trade time comes from the public trades endpoint (`/markets/trades?ticker=<ticker>&limit=1`, field `trades[0].created_time`), because the market record's `updated_time` is not the trade time. Observed at 11:20 AM: `KXNYCRENTSY-26-T4` had last 0.56, bid 0.54, ask 0.96.
- KTD3. The market percent and the segment percent are each rounded to whole points for display, and the gap is the difference of those rounded values (segment − market). One pure function, property-tested with fast-check: result within −100 to +100, sign flips when inputs swap, zero when equal, displayed gap equals displayed segment minus displayed market.
- KTD4. A run file is JSON in a runs directory, `data/runs/<ticker>.json` by default, validated by a zod schema at build time. The directory is read from `RUNS_DIR` (default `data/runs`) so tests can point at fixtures; the Render service never sets it. A run that fails validation fails `./check`.
- KTD5. The survey has three questions: the market's question in the segment's own terms (Yes share), one behavior question (for example, "How much did your rent change at your last renewal?"), and one open-text "In one sentence, why?" whose answers supply the 3 to 5 quotes.
- KTD6. Markets are chosen at run time from Kalshi's open economics markets by four tests: the closest group is obvious (renters, grocery shoppers, drivers); the market has a recent trade; it resolves within about 60 days; and within each market family, the strike with the narrowest current bid-ask spread and real 24-hour volume is chosen. Avoid three questions that all ask "will prices rise", so a uniform persona bias does not explain every gap. Candidates seen at 11:20 AM: `KXNYCRENTSY-26-*` (NYC rent), `KXGROCERYCPI-27JAN13-*` (grocery inflation), `KXAAAGASM-26NOV30-*` (US gas price; near-money strikes showed thousands in 24-hour volume).
- KTD7. The Kalshi base URL is read from `KALSHI_BASE_URL` (default the public host), so the "saved price" path can be tested against an unreachable address.

### Run-file fields (draft, confirmed by U3's first run)

Market ticker and question; segment label and place; market price and time at run; profile as a short list of labeled Census stats; each survey question with its answer split; Yes share (0 to 100); the behavior answer summary for the "what they do" line; 3 to 5 quotes, each with a short persona descriptor; panel size; optional Fit Score; Flashpoint survey and panel IDs; run time.

### Assumptions

- The Flashpoint account covers synthetic panel runs at no charge per call, as the docs say for signed-in users.
- A panel run of up to 100 personas takes up to about 45 minutes; the page ships with the run files that exist at 1:00 PM and adds later ones before the 3:00 PM freeze.
- The submission is due at 3:30 PM, when presentations start, and consists of a public GitHub repository and a LinkedIn or X post; the event page states no separate deadline.
- Kalshi's public market and trades endpoints stay readable without an account (both returned HTTP 200 on November 14, 2026).

### Risks

| Risk | Level | Mitigation |
|---|---|---|
| This chat cannot see Flashpoint's tools; the sign-in is saved but the session does not reload it | High | Run U3 in a separate visible session, which loads Flashpoint at start |
| No Flashpoint run completes, or the first call fails | High | U3 starts with one end-to-end test run; if it fails, the owner decides the fallback (see Open Questions) |
| A panel run takes longer than the time left | High | Cap at 100 personas, start the most liquid market first, ship the run files that exist |
| Flashpoint returns no verbatim answers for quotes | Medium | U3's first run checks which call returns open-text answers (analysis or export) before the other runs start |
| Thin Kalshi books make a price look precise when it is not | Medium | KTD6 spread test; card shows last-trade time; demo numbers are read from the live page just before presenting |
| A judge says "AI personas, not people" | Medium | R5 labeling, Fit Score, Census context passed into the panel, and the judge Q&A answer |
| Render free plan sleeps and the first load takes up to a minute | Low | Open the link just before judging |

### Open Questions

- If no Flashpoint run completes by 1:00 PM, does the entry reopen the event-wallet route (you hold the key and click each paid run), or ship with the Census profile and questions only and no gap? This is the owner's decision.

## Implementation Units

### U1. Project setup, event facts and the run-file contract

- **Goal:** a working repository with the factory's check command, the event facts, and the run-file schema fixed before the research session starts.
- **Files:** `package.json`, `app/`, `AGENTS.md`, `CLAUDE.md`, `FEATURES.md`, `docs/misses.md`, `check`, `scripts/check-features`, `playwright.config.ts`, `e2e/home.spec.ts`, `e2e/fixtures/run.fixture.json`, `lib/run-schema.ts`, `lib/run-schema.test.ts`, `.github/workflows/check.yml`, `.github/pull_request_template.md`, `.gitignore`, `.claude/launch.json`, `.compound-engineering/config.yaml`, `docs/sponsors/flashpoint/`.
- **Approach:** create the Next.js app; copy `scripts/check-features` and the pull request template from an existing factory project; add the `## Hackathon` section to `AGENTS.md` (event, times, cutoff, submission rules, new-work rule); write `lib/run-schema.ts` from the draft field list above and one fixture that passes it; add one FEATURES.md row for the home page with a smoke end-to-end test; save Flashpoint's `llms-full.txt` with its source URL and date. `.gitignore` covers `.env*`.
- **Test scenarios:** `./check` passes; `scripts/check-features --self-test` passes; the fixture passes the schema; a run with a missing Yes share, a share outside 0 to 100, or fewer than three quotes fails.
- **Verification:** first commit is dated after 11:00 AM CT, November 14, 2026; the schema is committed before U3 writes its first run file.

### U2. Kalshi price reader and gap math

- **Goal:** R2 and the gap number.
- **Files:** `lib/kalshi.ts`, `lib/gap.ts`, `lib/kalshi.test.ts`, `lib/gap.test.ts`.
- **Approach:** fetch the market and its latest trade server-side from `KALSHI_BASE_URL` with 60-second revalidation; apply KTD2; return price, source (`live` or `saved`), last-trade time and spread. `lib/gap.ts` also computes the average absolute gap across cards.
- **Test scenarios:** last price present → used; last price missing, bid and ask present → midpoint; all missing → saved price with source `saved`; network error or non-200 → saved price and saved time; string values like `"0.5600"` parse to 56; trades call fails → saved last-trade time; gap and average property tests per KTD3.

### U3. Flashpoint research runs (separate session)

- **Goal:** two or three valid run files that meet R3 to R5.
- **Files:** `data/runs/*.json`, `docs/research-runbook.md`.
- **Approach:** in a Claude Code session that has Flashpoint loaded:
  1. Pick the markets by KTD6 and write them in the runbook.
  2. Run the most liquid market end to end first: `demographics` for the segment's place, `tool_survey` to build the KTD5 survey, record its survey ID in the runbook, then `panel create_and_run` with up to 100 personas and the `demographics` result passed as panel context. Record elapsed time and whether a second run can start while one is in progress.
  3. Find which call returns the Yes share, the behavior summary and verbatim open-text answers (frequencies, analysis or export through `tool_survey`), and compare the output with `lib/run-schema.ts`. Report any field that differs to the main session before writing files; the main session owns the schema.
  4. Start the remaining runs, in parallel if step 2 showed that works.
  5. Write each run file as soon as its run finishes.
- **Test scenarios:** every file in `data/runs/` passes the schema in `./check`.
- **Execution note:** runs in parallel with U2 and U4, in its own session, touching only the files listed here.

### U4. Gap cards and detail view

- **Goal:** R1, R3, R5, R6.
- **Files:** `app/page.tsx`, `app/m/[ticker]/page.tsx`, `components/GapCard.tsx`, `components/SegmentPanel.tsx`, `lib/runs.ts`, `e2e/home.spec.ts`, `playwright.config.ts`.
- **Approach:** `lib/runs.ts` loads and validates every file in `RUNS_DIR` using `lib/run-schema.ts`. The home page shows the headline sentence, one card per run, and the average-gap line. The detail page shows the three panels and the full disclosure. Playwright sets `RUNS_DIR=e2e/fixtures`; a second Playwright web server sets `KALSHI_BASE_URL` to an unreachable address for the saved-price scenario.
- **Test scenarios (end-to-end):** home shows the headline, one card per fixture run, each with market %, segment name and %, signed gap and "AI panel" label, and the average-gap line; opening a card shows the profile, the questions and at least three quotes; with Kalshi unreachable, the card shows "saved price"; at 375 px the page has no sideways scroll (`scrollWidth` ≤ `innerWidth`).

### U5. Public link and repository

- **Goal:** checklist item 2 (public link with a try-an-example path, no login) and the submission repository.
- **Files:** `render.yaml`, `README.md`.
- **Approach:** push to a private GitHub repository under the owner's account, create the Render web service from it without `RUNS_DIR` set, and open the link signed out. Making the link and the repository public each needs the owner's yes first. Run a secret scan before the repository goes public.
- **Verification:** the public link returns 200 signed out and shows one card per file in `data/runs/`, and no fixture.

### U6. Demo and submission material

- **Goal:** checklist items 7 to 11, adapted to this event's submission (public repository plus a LinkedIn or X post).
- **Files:** `docs/demo-script.md`, `docs/judge-qa.md`, `docs/submission.md`, `README.md`.
- **Approach:** finalize the script from `brief.md`, reading the gap numbers from the live page just before presenting, and run the humanizer over it. `docs/submission.md` holds the post text: live link first, the two numbers, limits as scope choices after the strengths. The README carries at least seven captioned screenshots, gap card first, plus the three-width screenshots.

## Verification Contract

- `./check` passes: lint, type check, unit and property tests, Playwright end-to-end, feature-map check, build.
- Each `FEATURES.md` row's end-to-end proof passes.
- The public link is opened signed out at 375, 768 and 1440 pixels, with one screenshot per width.
- Every gap on screen is traced to its run file and to the market price and time shown on the same card.

## Definition of Done

- Real run files are saved and shown: three, or two with the third noted as late.
- The public link works signed out, shows no fixture, and the owner approved making it public.
- The repository is public with the owner's approval, and the secret scan is clean.
- The demo script is rehearsed in under 2 minutes, and `docs/judge-qa.md` and `docs/submission.md` exist.
