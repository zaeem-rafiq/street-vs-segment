# Features

What Street vs. Segment does today, in plain words, and the test that proves each feature. Proof names a test file and, after `#`, the name of the test inside it. The first proof is the feature's end-to-end test.

| Feature | What it does | How to reach it | Proof | Broken looks like |
|---|---|---|---|---|
| Gap cards | The home page shows one card per saved research run. Each card shows the market's Yes price, the segment's Yes share labeled "AI panel", the gap as a signed number of points with its direction, and an average-gap line above the cards | Open the site's home page | `e2e/home.spec.ts#shows one gap card per saved run with market, segment and signed gap`, `src/lib/gap.test.ts#always equals the displayed segment minus the displayed market` | No cards, a card missing a number, an unsigned gap, or a gap that does not equal the two numbers subtracted |
| Market detail | Opening a card shows who was asked (Census profile), the questions Flashpoint asked, and at least three quotes, with the full AI-panel disclosure | Click any card | `e2e/home.spec.ts#opens a market to show who was asked, the questions and their quotes` | A blank or error page, or a missing panel or quote |
| Saved-price fallback | When Kalshi cannot be reached, each card shows the price saved with the run and says "Saved price" | Happens on its own when Kalshi is down | `e2e/home.spec.ts#shows the saved price when Kalshi cannot be reached`, `src/lib/kalshi.test.ts#returns the saved price when the network fails` | An error page, a blank price, or a saved price labeled as live |
| Phone layout | The page fits a 375-pixel phone screen with no sideways scrolling | Open the site on a phone | `e2e/home.spec.ts#fits a 375-pixel phone screen without sideways scrolling` | The page scrolls sideways or text is cut off |
