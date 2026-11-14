# Research runbook: Flashpoint runs for Street vs. Segment

Runs made November 14, 2026, between 11:41 AM and 12:01 PM CT, in a separate Claude Code session on the owner's signed-in Flashpoint account (MCP server `flashpoint`). No paid recruitment, no wallet, no payments. Every number and quote in `data/runs/*.json` was copied from Flashpoint output. Nothing was typed by hand except the Census shares, which were recomputed from the raw Census counts (see Caveats).

## Markets picked (KTD6)

Kalshi read at 11:40 AM CT (17:40Z), then again at 12:01 PM CT.

| Ticker | Question | Segment | Market Yes | Bid / ask | 24h volume | Last trade |
|---|---|---|---|---|---|---|
| `KXAAAGASM-26NOV30-3.70` | Will average gas prices be above $3.70? (resolves Nov 30) | US drivers | 34% | 33 / 34 | 8,619 | Nov 14, 17:02Z |
| `KXGROCERYCPI-27JAN13-T2.5` | Will U.S. grocery inflation for December 2026 be above 2.5%? (resolves Jan 13) | US grocery shoppers | 37% | 28 / 37 | 0 | Nov 10 |
| `KXNYCRENTSY-26-T4` | Will New York City rent grow above 4% in December 2026? (resolves Jan 11) | NYC renters | 56% | 42 / 96 | 0 | Nov 12 |

Why these strikes:

- **Gas $3.70.** Only family with real volume. Spread is 1 cent, the same as $3.80 and $4.00. $3.70 was picked because its price (34%) is mid-range, where a gap is readable. The $4.00 strike has more volume but sits at 3%.
- **Grocery 2.5%.** No strike in this family has 24-hour volume. The narrowest spread overall is the 3.5% strike (1 cent), but it prices at 3%, so any panel would show a huge, meaningless gap. Picked the narrowest spread among strikes priced 10% to 90%: 2.5% (9 cents), then 2.0% (10 cents).
- **NYC rent 4%.** No strike has volume and spreads are 50 cents or wider. The narrowest in the 10% to 90% range is 5% (50 cents, last trade Nov 5). Picked 4% (55 cents) because it traded most recently (Nov 12), and it is the strike the plan already named. This is a deviation from "narrowest spread".
- **Not all "prices rise" questions:** gas asks for a price level on one date, rent asks about growth over 4%, grocery asks about CPI over 2.5%. All three are still price-direction questions, so a panel that leans "prices keep rising" would push all three gaps the same way. See Results.
- **Both prices on the page are stale for the thin markets.** Rent and grocery had no volume today, so their "live" price is a last trade from 2 to 4 days ago. The page shows the last-trade time.

## Method

1. `demographics` for the segment's place (US for drivers and grocery shoppers, New York City for renters), with the `audience` and `question` fields set. Returns raw Census counts plus an AI summary.
2. `tool_survey` with a brief that spells out the three questions word for word. Returns a survey ID and three question IDs. Survey was left in draft; nothing published.
3. `panel` with `action="create_and_run"`, `num_respondents=100`, `survey_id`, `research_objective`, and `context` (a plain-text summary of the Census numbers). Returns a job ID; poll with `action="status"`.
4. `tool_survey` again, with the survey ID and the run's `panel_id` and `run_id`, asking for the Q1 and Q2 counts and all 100 Q3 answers next to each respondent's Q1 answer, age, gender, city and occupation.

### IDs

| Market | Survey ID | Q1 / Q2 / Q3 question IDs | Panel ID (run) | Run ID | Job ID |
|---|---|---|---|---|---|
| Gas | `b60d9af9-4b35-4fc5-90ae-cd3aa7c45612` | `f91e0dbc-2636-4279-911c-1ed8b3e8373e` / `5dd4bfe7-c250-438c-9bbe-466114468712` / `ff263387-3f5f-46c8-b580-914ec11adffb` | `01a1db27-8462-7f41-82d5-4dd906a0de13` | `01a1db27-846e-75a3-b82d-b03fc424f99a` | `01a1db26-8731-7be2-bd21-3954d6c1c436` |
| NYC rent | `1ac0e2f9-d257-4551-97ee-0894f223175f` | `5ec20c6c-42ca-48f6-91b7-b5d1098789f8` / `0c3f471c-3523-4b33-8cd3-38dfb044d09d` / `3fe1f567-2ad0-48d7-88e2-62888fcf0a1f` | `01a1db29-2e99-729e-97fd-3d0ffd28fcf3` | `01a1db29-2ea6-7550-af2b-0784bc256b1d` | `01a1db28-3105-7d71-a734-74c657e56155` |
| Grocery | `9188a64e-f3c0-43f5-8a7a-33ecc81005a3` | `0145ffd6-7f21-406b-a6c1-f18f6f12a335` / `717b108d-2ed6-4442-b782-7bb81011ce6f` / `54f8e8c8-780a-4b10-becf-584415e86cf0` | `01a1db29-2293-7c27-8512-f2066580424f` | `01a1db29-22b2-7bd2-a2b0-e763930302ed` | `01a1db28-3186-7fe1-8547-e255ba1ecd7c` |

The run files store the panel ID from the run result. The panel-create result carries a different panel ID in each case; the analytics scope uses the run-result one.

### Timing

| Run | Started (UTC) | Finished (UTC) | Duration |
|---|---|---|---|
| Gas | 17:41:37 | 17:42:59 | 82 s |
| NYC rent | 17:43:26 | 17:44:48 | 82 s |
| Grocery | 17:43:26 | 17:44:46 | 80 s |

- Two runs started seconds apart and ran at the same time, both with 100 personas, both finished in about 80 s. A second run can start while one is running. (The plan assumed up to 45 minutes; real runs took under 1.5 minutes.)
- Getting the answers out took far longer than the runs: each `tool_survey` extraction of 100 responses took 5.4 to 5.6 minutes (325 s, 334 s, 329 s). The rent and grocery extractions ran in parallel.
- Whole session: about 20 minutes from first call to valid files.

### Which call returns what

| Needed | Returned by |
|---|---|
| Panel size, run status, IDs, panel summary (age range, gender split, income mix) | `panel` (`create_and_run` / `status`). The status result is about 135,000 characters; it is saved to a file by the tool |
| Yes share and behavior split | `tool_survey` extraction (frequencies of Q1 and Q2). `panel status` does not contain them |
| Verbatim open-text answers, with persona age, gender, city, occupation | `tool_survey` extraction. It fetches the 100 responses one by one, which is why it takes five minutes |
| Census profile | `demographics` |
| Fit Score | Not returned. The panel is `uncalibrated` and `fit_run_id` is empty, so `fitScore` is `null` in all three files |

Every schema field could be filled from real output, so the schema was not changed.

## Results

| Market | Market Yes | Panel Yes | Gap (panel minus market) |
|---|---|---|---|
| Gas above $3.70 | 34% | 59% | +25 points |
| NYC rent above 4% | 56% | 57% | +1 point |
| Grocery CPI above 2.5% | 37% | 63% | +26 points |

All three panels lean "Yes, prices go up". That fits the bias this plan warned about. The panel gap on rent is about zero, which is the one case where the panel and the market agree.

## Caveats the page must keep

- **Synthetic, uncalibrated personas.** Flashpoint reports `calibration_version: uncalibrated` and no Fit Score. The model behind the answers is `gpt-5.4-mini`.
- **Only gender was sampled to Census.** Flashpoint's own composition note on each panel: "Invented by the generator, not sampled: age, race, education, income. Do not describe the panel as matching Census data on those." Also: "independence — marginals matched, correlation not modelled". The Census profile on each card describes the real population, not the panel.
- **Citywide, not renter-specific.** The NYC Census stats are for all New York City residents, and the US stats are for all residents. Census gave no tenure, driver or shopper split.
- **Answers do not always match their own Yes/No.** Many Q3 sentences argue the opposite of the respondent's Q1 answer, or ignore Q1 and talk about Q2. Examples, from the gas panel: a "No" respondent writes "I expect gas to stay above that level"; a "Yes" respondent writes "I do think prices will likely stay under $3.70". Because of this, the saved quotes were chosen only from respondents whose sentence agrees with their own Q1 answer and talks about the market question. Quotes are verbatim; the choice is mine, not Flashpoint's. I did not count how many of the 100 sentences contradict their Q1 answer; it was common in all three panels.
- **Q2 has the same noise** in the rent panel (for example a "went down" respondent describing a 2% rise), so the behavior split is what the panel answered, not a clean fact.
- **Market price time.** Prices in the run files are the Kalshi reads at 18:01Z, after the runs (17:42Z to 17:45Z). The three prices had not changed between 17:40Z and 18:01Z, apart from the rent bid.
- **Census shares were recomputed.** The `demographics` AI summary contained wrong numbers (for example 138.3 million adults aged 25 to 64 when the raw counts add to 171.9 million, and 27.1% of households under $50,000 when the counts give 33.8%). The profile in the files uses only shares computed from the raw Census counts. The panel `context` text I sent to `panel` did contain some of those wrong AI-summary shares (income splits, and the 25-to-64 totals). That should not matter much because the generator invents income anyway, but the panel did not get exactly the right context.
- **Quotes are a pick of 5 from 100.** The full table of 100 answers per run was shown to the session that made the files; it is not saved in the repository.

## Round 2 (1:10 PM to 1:35 PM CT): known-answer checks, a number estimate, breakdowns

Added to the three run files after the main session approved more depth. Same rules: no paid recruitment, no wallet.

### 1. Known-answer check (`knownAnswerCheck`)

Each check asks a fresh 100-persona panel one Yes/No question whose answer is already a public fact, in the same domain and wording style as the market question. The panel is built with `panel create_and_run`, from the same description and Census context as the main panel. It is **not the identical 100 personas**: Flashpoint offers no MCP call to run an existing panel by ID (`panel run` is not exposed; the docs say to use `create_and_run`).

| Market | Question (short) | Fact | Panel Yes | Verdict |
|---|---|---|---|---|
| Gas | Gas above $3.70 on Nov 2, 2026 (EIA)? | Yes. EIA weekly regular gasoline was $4.153 on Mon Nov 2, 2026 | 24% | Panel mostly wrong |
| Grocery | Grocery prices over 2.5% higher in Sept 2026 than Sept 2025 (CPI Food at home)? | No. Index 321.758 vs 316.042, +1.8% | 67% | Panel mostly wrong |
| NYC rent | NYC rent over 4% higher in Oct 2026 than Oct 2025 (StreetEasy Rent Index)? | Yes. $4,014 vs $3,793, +5.8% | 59% | Panel leans right |

Facts and where each came from (all read on Nov 14, 2026, around 1:05 PM CT):

- **Gas:** FRED series GASREGW (EIA weekly retail gasoline, US regular, all formulations), fetched as CSV from `fred.stlouisfed.org/graph/fredgraph.csv?id=GASREGW`. Nov 2: 4.153. The next week (Nov 9) is 3.995. This is EIA's price, not AAA's, so the question names EIA.
- **Grocery:** BLS Public Data API, series `CUUR0000SAF11` (CPI-U Food at home, US city average, not seasonally adjusted). Sept 2026 321.758, Sept 2025 316.042: 321.758 / 316.042 − 1 = 1.81%. The October 2026 index (322.876) exists, but October 2025 is blank ("Data unavailable due to the 2025 lapse in appropriations"), so no October year-over-year change can be computed. September is the latest month with a computable change.
- **Rent:** the StreetEasy data file `rentalIndex_All.zip` (NYC column, file dated Nov 5, 2026), downloaded from `cdn-charts.streeteasy.com/rentals/All/`. October 2026 4,014; October 2025 3,793; 4,014 / 3,793 − 1 = 5.83%. StreetEasy's own page returned HTTP 403 to my fetch, so `sourceUrl` points at the data dashboard (the source Kalshi names), while the numbers come from that file.

Surveys and panels (survey ID, panel ID of the run, run ID, run time):

| Market | Survey ID | Panel ID | Run ID | Run time |
|---|---|---|---|---|
| Gas | `068abf5e-0499-476b-9996-df3155a7e100` | `01a1db7b-1b3a-7aa5-a1ea-85ee1f0c1774` | `01a1db7b-1b44-7da3-b47c-0f337ba137a1` | 64 s |
| Grocery | `77bee116-69ae-41af-b5df-2bc4d33e7557` | `01a1db7b-1d0b-7b46-8c38-60db5be33f63` | `01a1db7b-1d15-7e42-820c-09817176e6cb` | 63 s |
| NYC rent | `35490afa-2eb3-451e-a8b9-941ad0c520f9` | `01a1db7b-30d5-71ea-a9a1-49f4a006080f` | `01a1db7b-30e0-7ff3-ad6c-08b269959d40` | 66 s |

Yes shares come from `tool_survey` frequency tables scoped to each run (24/76, 67/33, 59/41). The run files store only the survey ID, as the schema allows.

### 2. Number estimate (`estimate`)

`tool_survey` does support a numeric question for synthetic panels: it creates a `float` question (decimals allowed, range $0 to $20 set by the agent) and the panel stores each persona's answer as a number, not text. So #2 worked, for gas only. I did not ask the grocery and rent panels for numbers (the plan named gas, and the gas number can be read against every Kalshi strike).

- Survey `4fd7a7c9-f4d0-4109-b784-943a21817d9e`, panel `01a1db7b-f0b1-72ce-a630-b166cd970259`, run `01a1db7b-f0bd-7e72-8f51-8cb9f610812b`, 110 s.
- Question: "What do you expect the US average price of a gallon of regular gas to be on November 30, 2026, in dollars? Enter a number such as 3.85."
- 100 values, none dropped, read from Flashpoint's CSV export of the run (last column `Q1`). Min 3.12, max 5.10, median 4.075, **mean 4.0356**. 73 of the 100 values are above 3.70.
- The extraction agent reported a mean of 4.067 from its own sum. That was wrong; the saved values are from the CSV and the mean above is my recomputation.
- The estimate panel (mean $4.04, 73% above $3.70) disagrees with the gas control panel (24% said gas was above $3.70 on Nov 2, when it was $4.15). Same kind of persona, two different pictures of today's price. Read the panel's number as its guess, not as knowledge.

### 3. Breakdowns (`breakdowns`)

Split the market-question Yes share of the three existing panels (same panel and run IDs as the main files) by age band and by Census region of each persona's city. Age and city come from each response's `respondent_metadata.persona`; they are not in the survey export. NYC rent has one city, so it has an age split only.

- Age bands: under 35, 35 to 54, 55 and over.
- Regions: Northeast, Midwest, South, West, from the persona's city (Census Bureau regions). Portland was assumed to be Portland, Oregon (West). Baltimore is South. Buffalo, Newark, Pittsburgh, Philadelphia, Boston and New York are Northeast.
- Check on the rows: the Yes counts I got from the per-persona tables are 59 (gas), 63 (grocery) and 57 (rent), the same as Flashpoint's frequency tables. The extraction agents' own summaries said 65 and 62 for grocery and rent; those were miscounts, not data errors, and I used my own counts.
- Groups are small (17 to 42 people per region, 27 to 42 per age band). Differences of under about 15 points are within noise for samples this size.

| Market | Age (Yes share) | Region (Yes share) |
|---|---|---|
| Gas | under 35: 62.1% (n 29); 35 to 54: 62.5% (40); 55+: 51.6% (31) | Northeast 36.8% (19); Midwest 66.7% (18); South 61.9% (42); West 66.7% (21) |
| Grocery | under 35: 79.3% (29); 35 to 54: 47.6% (42); 55+: 69.0% (29) | Northeast 58.8% (17); Midwest 72.2% (18); South 55.3% (38); West 70.4% (27) |
| NYC rent | under 35: 81.2% (32); 35 to 54: 51.2% (41); 55+: 37.0% (27) | none (one city) |

The one clear pattern is NYC rent by age: young renters say Yes four times in five, renters 55 and over under four in ten.

### Round 2 caveats

- The control panels are new panels, not the same personas as the main runs. A panel that is wrong on a known fact is evidence about this kind of panel, not about those specific 100 people.
- The control questions name a source and a month so the answer is checkable, but the personas do not have the data in front of them. They answer from general knowledge, so the check measures how current that knowledge is.
- Facts were checked once, by me, against the sources above. Nothing about them was reviewed by anyone else.

## Added at 2:10 PM CT: estimates for grocery and rent

The `estimate` fields for grocery and NYC rent come from a second Flashpoint session (Lane D), copied from `data/flashpoint-extra/`. Its notes are in `data/flashpoint-extra/NOTES.md`. The gas estimate comes from this runbook's own session.

- These are new panels of 100 personas, not the panels behind the Yes shares. Gas medians differ between two independent panels: $4.07 (this session) and $3.95 (Lane D).
- Asked for a number, the panels lean higher than when asked Yes or No: 99% of grocery estimates are above 2.5%, against a 63% Yes share.
- Answers clump on a few values (52 of 100 grocery answers are 2.8 or 3.2; 18 rent answers are exactly 4.0), so the spread is narrower than 100 independent views would give.
