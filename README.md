# Street vs. Segment

**Live:** https://street-vs-segment.onrender.com

Markets show what is priced in. They don't show what the people living the outcome expect. Street vs. Segment puts a live [Kalshi](https://kalshi.com) prediction-market price next to a [Flashpoint.AI](https://flashpoint.ai) panel of the people closest to the outcome, and shows the gap in percentage points.

Built at Hack the Unreachable (Flashpoint.AI), November 14, 2026, for the Investment Alpha track: "Find the gap between what's priced in and what key segments privately believe".

## How it works

1. **Price.** The app reads the market's Yes price and last trade from Kalshi's public API on every page load (read-only; nothing trades).
2. **Segment.** Claude picks the group whose lives decide the outcome (renters for rent, shoppers for grocery prices) and the place.
3. **Research.** Over Flashpoint's MCP server, Claude calls `demographics` for the place's Census profile, `tool_survey` to build and check a three-question survey, and `panel create_and_run` to run a synthetic panel matched to that profile. Each run is saved in `data/runs/`, and `docs/research-runbook.md` records exactly what was asked.
4. **Gap.** Both percentages are rounded to whole points and subtracted, so the number on the card always matches the two beside it.

## Limits, as scope choices

The segment answers come from Flashpoint synthetic personas matched to Census data, not live respondents. Flashpoint can recruit real people (Prolific, Dynata, Cint) with one call; this build leaves that out for budget. Thin Kalshi books can move a price, so each card shows the last trade time and the bid-ask spread.

## Run it

```bash
npm ci
npm run dev
```

`./check` runs the secret scan, the feature map, lint, types, unit and property tests, the build and the browser tests.
