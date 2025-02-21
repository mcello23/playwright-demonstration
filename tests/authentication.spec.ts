import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test.use({ storageState: './auth/auth.json' });

  test('should be authenticated', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verificar se o token está presente
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeTruthy();

    // Verificar se o logo está visível
    await expect(page.locator('[data-test="header-logo"]')).toBeVisible({
      timeout: 10000,
    });
  });
});
