import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  testIgnore: ['**/dist/**'],
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:5175',
    headless: true,
  },
  projects: [
    { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
