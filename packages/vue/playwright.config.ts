import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for visual regression testing.
 *
 * Builds and serves the Histoire static site, then runs screenshot
 * comparison tests against each component story variant.
 */
export default defineConfig({
  testDir: './visual-tests',
  outputDir: './visual-tests/test-results',
  snapshotDir: './visual-tests/__snapshots__',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    },
  },

  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
  },

  // Chromium-only for now — keeps CI fast and baselines simple.
  // Can expand to Firefox/WebKit once cross-browser visual parity is a priority.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx histoire preview --port 6006',
    port: 6006,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
