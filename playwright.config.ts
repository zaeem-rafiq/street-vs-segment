import { defineConfig, devices } from "@playwright/test";

// Two servers built from the same `npm run build`, both showing the fixture runs in
// e2e/fixtures. The second one cannot reach Kalshi, to prove the saved-price fallback.
const fixtures = "RUNS_DIR=e2e/fixtures";

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `${fixtures} PORT=3100 npm run start`,
      url: "http://localhost:3100",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `${fixtures} KALSHI_BASE_URL=http://127.0.0.1:9 PORT=3101 npm run start`,
      url: "http://localhost:3101",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
