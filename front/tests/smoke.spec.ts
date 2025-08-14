import { test, expect } from '@playwright/test';

test('home loads and has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Dicionário/i);
});
