import { test, expect } from '@playwright/test';

// Simple smoke test to verify theme is persisted across reloads
// Requires app to be running at baseURL

test('theme toggles and persists after reload', async ({ page, baseURL }) => {
  await page.goto(baseURL!);
  const html = page.locator('html');
  const toggle = page.getByTestId('theme-toggle');

  // initial state
  const initialDark = await html.evaluate((el) => el.classList.contains('dark'));

  // toggle
  await toggle.click();
  const afterClickDark = await html.evaluate((el) => el.classList.contains('dark'));
  expect(afterClickDark).toBe(!initialDark);

  // reload and check persistence
  await page.reload();
  const afterReloadDark = await html.evaluate((el) => el.classList.contains('dark'));
  expect(afterReloadDark).toBe(afterClickDark);
});
