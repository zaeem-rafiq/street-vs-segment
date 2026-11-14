import { readdirSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const fixtureCount = readdirSync(path.resolve(__dirname, "fixtures")).filter((name) => name.endsWith(".json")).length;

test("shows one gap card per saved run with market, segment and signed gap", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The market prices one thing");
  const cards = page.getByTestId("gap-card");
  await expect(cards).toHaveCount(fixtureCount);
  for (const card of await cards.all()) {
    await expect(card.getByTestId("market-percent")).toHaveText(/^\d{1,3}%$/);
    await expect(card.getByTestId("segment-percent")).toHaveText(/^\d{1,3}%$/);
    await expect(card.getByTestId("segment-label")).toContainText("AI panel");
    await expect(card.getByTestId("gap-value")).toHaveText(/^([+−]\d{1,3}|0)\s*pts?$/);
    await expect(card.getByTestId("gap-phrase")).toContainText("the market");
  }
  await expect(page.getByTestId("average-gap")).toContainText(`Across ${fixtureCount} markets`);
  await expect(page.getByTestId("disclosure")).toContainText("AI personas");
});

test("opens a market to show who was asked, the questions and their quotes", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("gap-card").filter({ hasText: "Fixture renters" }).click();
  await expect(page).toHaveURL(/\/m\/KXNYCRENTSY-26-T4$/);
  await expect(page.getByTestId("panel-profile")).toContainText("Fixture stat A");
  await expect(page.getByTestId("panel-questions")).toContainText("Fixture yes/no question");
  expect(await page.getByTestId("quote").count()).toBeGreaterThanOrEqual(3);
  await expect(page.getByTestId("disclosure")).toContainText("Real respondents are one Flashpoint call away");
});

test("shows the saved price when Kalshi cannot be reached", async ({ page }) => {
  await page.goto("http://localhost:3101/");
  await expect(page.getByTestId("price-status")).toHaveText(/^Some prices are saved, not live/);
  const sources = page.getByTestId("price-source");
  await expect(sources).toHaveCount(fixtureCount);
  for (const source of await sources.all()) {
    await expect(source).toContainText("Saved price");
  }
});

test("fits a 375-pixel phone screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByTestId("gap-card").first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("shows the known-answer check on the card and in full on the market page", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("article").filter({ hasText: "Fixture renters" });
  const line = card.getByTestId("known-answer");
  await expect(line).toContainText("Known-answer check");
  await expect(line).toContainText("18% of this panel said Yes");
  await expect(line.getByRole("link", { name: "Fixture source" })).toHaveAttribute("href", "https://example.com/fixture");
  await card.getByTestId("gap-card").click();
  await expect(page).toHaveURL(/\/m\/KXNYCRENTSY-26-T4$/);
  const panel = page.getByTestId("known-answer");
  await expect(panel).toContainText("Fixture known-answer question");
  await expect(panel).toContainText("Fixture fact");
  await expect(panel).toContainText("missed by 18 points");
});

test("shows who drives the gap with each group's Yes share", async ({ page }) => {
  await page.goto("/m/KXNYCRENTSY-26-T4");
  const section = page.getByTestId("breakdowns");
  await expect(section).toContainText("Who drives the gap");
  await expect(section).toContainText("By age");
  await expect(section).toContainText("Under 35");
  await expect(section).toContainText("40%");
  await expect(section).toContainText("By region");
});

test("shows the strike ladder section, and says why when Kalshi's strikes cannot be loaded", async ({ page }) => {
  await page.goto("http://localhost:3101/m/KXNYCRENTSY-26-T4");
  const ladder = page.getByTestId("strike-ladder");
  await expect(ladder).toContainText("Fixture estimate question");
  await expect(ladder).toContainText("Panel median estimate");
  await expect(ladder).toContainText("could not be loaded");
});
