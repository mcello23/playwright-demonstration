import { expect, test } from '@playwright/test';

test.describe('Login', () => {
  test('should be logged in', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveURL('/en');
    await expect(page).toHaveTitle(/IDV Suite/);
  });
});
