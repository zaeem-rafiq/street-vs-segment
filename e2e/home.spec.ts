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
