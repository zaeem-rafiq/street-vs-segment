# Street vs. Segment — build brief

Hack the Unreachable (Flashpoint.AI), Saturday, November 14, 2026. Track: Investment Alpha.

## The idea in one sentence

It shows the gap between what a betting market expects and what the people who decide the outcome say they will do.

## What you will see

- A web page with three ready examples, each a live Kalshi economics market, for example NYC rent, grocery inflation or gas prices.
- Each example shows one gap card: "Market 64% · NYC renters 38% · Gap −26 points" (placeholder numbers).
- Under the card, there are three panels: who the segment is (Census data from Flashpoint), the questions Flashpoint wrote, and what the segment answered.
- A "Run a new market" button runs the full loop live. Each live run spends about $1.15–$1.65 of the event wallet.

## How it works

1. The app reads the market's price from Kalshi's public data. No account is needed, and the app never trades. I tested it at 10:58 AM, and it returned HTTP 200.
2. Claude names the group of people whose behavior settles the market, and the place.
3. Flashpoint `demographics` returns that group's Census profile.
4. Flashpoint `tool_survey` builds a short survey from that profile.
5. Flashpoint `panel create_and_run` runs up to 200 AI personas of that group. The docs say this takes minutes.
6. The app compares the panel's answer with the market price and shows the gap.

## Cost

| Item | Paid by | Amount |
|---|---|---|
| Flashpoint calls | Event wallet | $20 total, about 12 full runs |
| Claude calls | Event's free Anthropic API access | $0 to you |
| Hosting on Render | Free plan | $0 |

## Schedule (Central time)

| Time | What |
|---|---|
| 11:00 | Build starts |
| 12:30 | **Change cutoff.** The idea is frozen after this. |
| 1:00 | Public link live. Midday audit. |
| 1:00–3:00 | Pre-run 3 examples, polish, README |
| 3:00 | Code freeze. Rehearse the demo. |
| 3:30 | Presentations. Repo and post due, assumed. |

## Risks

- **High:** a live run takes minutes, and long runs can take about 45 minutes. The demo uses saved runs, and a live run is shown only if it is fast that day.
- **High:** the wallet key leaks into the public repo, and the $20 can be stolen. I will keep the key out of Git and run a secret scan before the repo is made public.
- **Medium:** a judge says "these are AI personas, not people". The answer is the panel's Fit Score against Census data. Swapping in real people is one Flashpoint call (`recruit`), left out for budget.
- **Medium:** I can't sign crypto payments, so I can't run a paid call myself. Until you choose how we connect, I build against the response formats in Flashpoint's docs.

## Obvious builds we must beat

- A chat bot that asks AI personas any question.
- Social-media sentiment compared with a stock price.
- A synthetic focus group about a policy.

What a judge sees on our first screen and not on theirs: a real market price next to a measured segment, with the gap as one number.

## Two-minute demo script (draft)

- **0:00 hook (gap card already on screen):** "Markets tell you what's priced in. They don't tell you what the people who move the number plan to do."
- **0:05–0:30:** the NYC rent card. "The market says 64%. NYC renters say 38%. That's a 26-point gap."
- **0:30–1:15, "So we built…":** "Pick any Kalshi economics market. Claude names the people whose choices settle it. Flashpoint pulls their Census profile, writes the survey and runs a calibrated panel of them. We put their answer next to the price."
- **1:15–1:35, result:** "Across three markets, the segment and the market disagreed by an average of N points."
- **1:35–1:50, close:** "The most valuable signal is with people no trader asks. Now an agent asks them before the market moves."
- **1:50–2:00, limits:** "Today's panels are AI personas checked against Census data. Real respondents are one Flashpoint call away."

Screens in order. This is the build list.
1. Gap card. Real product, saved run.
2. Segment profile. Real Flashpoint `demographics` output.
3. Survey questions. Real Flashpoint `tool_survey` output.
4. Answers and quotes. Real Flashpoint `panel` output.
5. Three-market summary. Real product.

## Stack

Next.js and Tailwind, hosted on Render. Packages: the official x402 payment client and viem, for wallet signing, plus the Anthropic SDK.
Project folder: `~/Documents/Projects/street-vs-segment`.
