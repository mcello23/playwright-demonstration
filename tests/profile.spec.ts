import { expect, test } from '@playwright/test';

test.describe('Profile and tenants validation @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('As a user, I want to click on my Profile and see the options @smoke', async ({ page }) => {
    await page.locator('[data-test="user-name"]').click();
    const logoutOption = page.locator('[data-test="option-menu"]');
    await expect(logoutOption).toContainText('Log out');
  });

  test('As a user, I want to see Tenants available in my profile @smoke', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo' }).click();
    const tenantText = page.getByText('Select a tenant');
    await expect(tenantText).toBeVisible();

    await page.locator('[data-test="modal-tenant"] button').first().isVisible();
    await page.getByRole('button', { name: 'demo 8d04089d-8273-442e-ad40-2bf10ff494b3' }).isVisible();
  });
});
