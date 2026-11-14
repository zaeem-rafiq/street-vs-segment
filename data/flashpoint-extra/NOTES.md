# Lane D notes: estimates (#2) and breakdowns (#3)

Made November 14, 2026, 1:22 PM to 1:41 PM CT, on the owner's signed-in Flashpoint MCP server (`flashpoint`). No `recruit`, no wallet, no payments. Nothing in `data/runs/`, `src/` or the runbook was touched.

## Files

| File | What it is | Source |
|---|---|---|
| `<ticker>.estimate.json` | `{ticker, estimate}` matching `runSchema.shape.estimate` | Expanded from `<ticker>.estimate.freq.csv` |
| `<ticker>.estimate.freq.csv` | Flashpoint `get_frequencies` distribution (value, count), copied verbatim from `tool_survey` output | Flashpoint |
| `<ticker>.breakdowns.json` | `{ticker, breakdowns}` matching `runSchema.shape.breakdowns` | Computed from `<ticker>.rows.csv` |
| `<ticker>.rows.csv` | One row per persona of the existing run: Q1 answer, age, city, state, copied verbatim from `tool_survey` output | Flashpoint |

All six JSON files pass the `estimate` / `breakdowns` shapes in `src/lib/run-schema.ts` (checked with a scratch script run through `npx tsx`; `tsx` was fetched by npx and not added to the project).

## Task 1: estimates (new surveys and new panels)

`tool_survey` said numeric questions are supported for synthetic panels ("Synthetic personas answer `number` and `float` questions by producing a numeric value"). Each survey has one `float` question and was left in draft.

| Market | Survey ID | Question ID | Range allowed | Job ID | Analytics panel ID | Run ID | Run time (UTC) |
|---|---|---|---|---|---|---|---|
| Gas | `dd9e7a5a-e736-4be2-a416-49da9779b500` | `f58cf1d7-5832-4f65-951a-4517d0aaddaa` | 0 to 20 | `01a1db8a-2966-7850-858b-44df2aa053e7` | `01a1db8b-0811-72ab-8e6a-6a94da3947ba` | `01a1db8b-081b-7d93-8b78-875f7f36b7c9` | 19:30:27 to 19:31:35 (68 s) |
| Grocery | `cb721cab-c632-4440-89aa-c7b68afcf312` | `0feee65a-41d9-412e-bc41-5f5350582f21` | -20 to 50 | `01a1db8a-29f0-76d0-9b6f-b9758408c3b4` | `01a1db8a-f0f7-7f24-9036-2fa28df1358d` | `01a1db8a-f104-7150-887d-8a95dcb045c7` | 19:30:27 to 19:31:30 (62 s) |
| NYC rent | `125ff76e-2340-4ce3-9705-cdd338eff1af` | `95f188af-b535-490e-9fac-bbfb13196c4f` | -50 to 50 | `01a1db8a-2a69-75e0-a294-10b2e954294c` | `01a1db8a-f620-73cd-95fb-e7005c58eb5c` | `01a1db8a-f628-71e3-bb25-1b49a595a764` | 19:30:27 to 19:31:32 (64 s) |

- Calls: `tool_survey` (build) x3, `demographics` (United States; New York City) x2, `panel create_and_run` x3 with 100 personas, `panel status` x3, `tool_survey` (`get_frequencies`) x3 plus one failed attempt at a per-row CSV for gas. Task 2: `tool_survey` row extraction x3, rent analytics frequency check x1, rent re-read x1, rent spot check of 12 response IDs x1.
- All three runs: 100 of 100 personas complete, `calibration_version: uncalibrated`. Gas run reports model `gpt-5.4-mini`.
- Panel `context` was written from the raw Census counts only (adult age shares, gender, median age, median household income), not from the `demographics` AI summary.
- Extraction was fast (about 8 s each) because `get_frequencies` returns the whole distribution. Per-persona rows were not needed: the values array is the distribution expanded and sorted, so it carries no persona order.
- The gas per-row attempt failed: the agent only had a 10-row export preview and said so. The distribution call replaced it.

### Results

| Market | Kalshi strike | Panel median | Panel mean | Range | Share of values above strike | Share exactly at strike |
|---|---|---|---|---|---|---|
| Gas ($/gal, Nov 30) | 3.70 | 3.95 | 3.98 | 3.20 to 4.85 | 70% | 6% |
| Grocery CPI (%, Dec) | 2.5 | 3.2 | 3.48 | 2.5 to 6.8 | 99% | 1% |
| NYC rent (%, year to Dec) | 4 | 4.5 | 5.16 | -3.5 to 20 | 58% | 18% |

Things that look wrong or need care:

- **These are new personas.** The estimate panels are not the panels behind the Yes shares in `data/runs/`. Panel numbers from the two cannot be paired persona by persona.
- **Estimate and Yes share disagree.** Gas: 70% of estimates are above $3.70, but the saved Yes share is 59%. Grocery: 99% above 2.5%, against a saved Yes share of 63%. The same kind of model gives a different answer when asked for a number than when asked yes or no.
- **Clumped answers.** Grocery: 52 of 100 answered 2.8 or 3.2. Rent: 27 answered 4.5 and 18 answered exactly 4.0, the strike. Values look like a few model defaults rather than 100 independent views.
- **Rent has outliers** (12, 15, 16, 20 and -3.5). The median is safer than the mean on the page.
- Unit check: gas values are dollars (3.20 to 4.85), not cents; grocery and rent are percents, not fractions. No rescaling was done.

## Task 2: breakdowns (existing runs, no new panels)

Rows came from `tool_survey`, scoped to the run-result panel and run IDs in the runbook, one call per market (about 3 to 3.5 minutes each).

| Market | Rows | Yes in rows | Saved Yes share | Agent's own stated Yes total |
|---|---|---|---|---|
| Gas | 100 | 59 | 59 | 62 (wrong; the rows it printed give 59) |
| Grocery | 100 | 63 | 63 | 65 (wrong; the rows it printed give 63) |
| NYC rent, first read (rejected) | 100 | 59 | 57 | 60 (wrong; the rows it printed give 59) |
| NYC rent, second read (used) | 100 | 57 | 57 | 57 |

- Gas and grocery rows match the saved Yes share, so their splits are consistent with the page.
- **Rent rows disagree.** Flashpoint analytics (`get_frequencies`, plus a filter `Q1 == Yes`) gives 57 Yes, 43 No. The per-row extraction gives 59 Yes. So at least 2 rent rows carry the wrong label, and I cannot tell which. Resolved by a second read; see "Rent recheck" below.
- **Rent has no region split.** Every rent persona's location is "New York City, USA", so all fall in the Northeast. The schema needs at least two groups, so the rent file holds the age dimension only.
- **State was inferred by the Flashpoint agent** from the city (raw location is "City, USA"). Ambiguous names: Portland was mapped to OR in gas (3 rows) and grocery (4 rows), Newark to NJ. Kansas City, Springfield and similar did not appear.
- Census regions: Northeast CT ME MA NH RI VT NJ NY PA; Midwest IL IN MI OH WI IA KS MN MO NE ND SD; South DE DC FL GA MD NC SC VA WV AL KY MS TN AR LA OK TX; West AZ CO ID MT NV NM UT WY AK CA HI OR WA.
- Age bands: under 35 (age 34 and below), 35 to 54, 55 and over. `yesShare` is rounded to whole points.
- Caveat from the runbook still applies: the generator invents age; only gender was sampled to Census. Group sizes are small (17 to 42), so a 10-point difference between groups is within noise.

### Splits (Yes share, n in brackets)

| Market | Under 35 | 35 to 54 | 55 and over | Northeast | Midwest | South | West |
|---|---|---|---|---|---|---|---|
| Gas | 57% (28) | 66% (41) | 52% (31) | 37% (19) | 63% (19) | 64% (42) | 65% (20) |
| Grocery | 79% (29) | 48% (42) | 69% (29) | 59% (17) | 72% (18) | 55% (38) | 70% (27) |
| NYC rent | 81% (32) | 51% (41) | 37% (27) | n/a | n/a | n/a | n/a |

### Rent recheck

- A second `tool_survey` call (about 5.5 minutes) first tried an analytics age filter. It failed: `age >= 35 AND age < 55` returned all 100 and the other bands returned 0, so persona age is not a filter field. The agent then read all 100 stored responses and returned `response_id,q1_answer,age`. Those rows total 57 Yes, matching analytics.
- The brief told it the target of 57, so I did not trust the total alone. Aligning the two reads shows they agree on rows 1 to 38 and then diverge: the first read dropped some personas and repeated others. A third call fetched 12 of the disputed response IDs directly. All 12 exist and all 12 match the second read on both answer and age.
- `KXNYCRENTSY-26-T4.rows.csv` is now the verified second read (with response IDs). The first read is kept as `KXNYCRENTSY-26-T4.rows.first-read-rejected.csv` for the record. The rent split in the table above is replaced by: under 35 81% (32), 35 to 54 51% (41), 55 and over 37% (27). The agent's own summary table (34/39/27) miscounted its own CSV; the numbers here are computed from the CSV.
- **Risk for gas and grocery:** their rows came from the same kind of first read as the rejected rent read. Their Yes totals match the saved shares, but the same row shuffle could hide inside a matching total. They were not re-read for lack of time. Treat their splits as less certain than rent's.
