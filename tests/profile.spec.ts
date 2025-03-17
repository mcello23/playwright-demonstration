import { expect, interceptTenantExchange, loginUnsigned, test } from '../utils/fixtures/e2e';

test.describe('Happy path: Profile and tenants validation @regression', async () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
  });

  test('Clicks on "Profile" and sees all options @smoke', async ({ page }) => {
    await page.locator('[data-test="user-name"]').click();
    const logoutOption = page.locator('[data-test="option-menu"]');
    await expect(logoutOption).toContainText('Log out');
  });

  test('Clicks on the Tenant button and sees all elements available @smoke', async ({ page }) => {
    await page.getByRole('button', { name: 'Demo' }).click();
    const tenantText = page.getByText('Select a tenant');
    await expect(tenantText).toBeVisible();

    await page.locator('[data-test="modal-tenant"] button').first().isVisible();
    await page
      .getByRole('button', { name: 'demo 8d04089d-8273-442e-ad40-2bf10ff494b3' })
      .isVisible();
    await page
      .getByRole('button', { name: 'demo 8d04089d-8273-442e-ad40-2bf10ff494b3' })
      .isEnabled();
    await page
      .getByRole('button', { name: 'idv-prueba 809b44ff-26af-4ffc-9bb8-5dd9b0e87c44' })
      .isVisible();
    await page
      .getByRole('button', { name: 'idv-prueba 809b44ff-26af-4ffc-9bb8-5dd9b0e87c44' })
      .isEnabled();
  });

  test('Changes the Tenant of a user and validates through API/UI @smoke', async ({ page }) => {
    await page.route('**/realms/idv/tenant-exchange', interceptTenantExchange);

    await page.getByRole('button', { name: 'Demo' }).click();
    const tenantText = page.getByText('Select a tenant');
    await expect(tenantText).toBeVisible();

    await page.getByRole('button', { name: 'idv-prueba 809b44ff-26af-4ffc' }).click();
    await page.getByRole('button', { name: 'Select' }).click();
    await page.waitForResponse('**/realms/idv/tenant-exchange');
    await page
      .locator('[data-test="update-tenant"]', { hasText: 'Successfully changed tenant' })
      .isVisible();
    const tenantButton = page.getByRole('button', { name: 'idv-prueba' });
    await tenantButton.isVisible();
  });

  test('Access a IDV URL with a different tenant associated to my user and continues to navigate', async ({
    page,
  }) => {
    await page.waitForURL(/.*tenant.*/);
    await page.goto('/en/tenant/809b44ff-26af-4ffc-9bb8-5dd9b0e87c44/operations');
    const operationsHeader = page
      .locator('[data-test="header"] div')
      .filter({ hasText: 'Operations' });
    await expect(operationsHeader).toBeVisible();
  });
});

//TODO: add different logedin auth state for this test

test.describe('Negative path: Profile and tenants validation @regression', () => {
  test.use({ storageState: 'auth/unsigned.json' });
  test.beforeEach(async ({ page }) => {
    loginUnsigned(page);
  });

  test('Access a IDV URL with a tenant not associated to my user and sees the 404 page', async ({
    page,
  }) => {
    await page.waitForURL(/.*tenant.*/);
    await page.goto('/en/tenant/809b44ff-26af-4ffc-9bb8-5dd9b0e87c44/operations');
    await page.waitForLoadState('networkidle');

    const topLogo = page.getByRole('img').first();
    await expect(topLogo).toBeVisible();

    const errorImage = page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();

    const firstErrorText = page.getByText('Houstoooon, something went wrong!');
    await expect(firstErrorText).toBeVisible();

    const secondErrorText = page.getByText('Click below to land in IDV Suite');
    await expect(secondErrorText).toBeVisible();

    const homeButton = page.locator('[data-test="error-button"]').getByText('Land here');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toBeEnabled();
  });

  test('Access a IDV URL with a tenant not associated to my user, sees the 404 page and returns to landing', async ({
    page,
  }) => {
    await page.waitForURL(/.*tenant.*/);
    await page.goto('/en/tenant/809b44ff-26af-4ffc-9bb8-5dd9b0e87c44/operations');
    await page.waitForLoadState('networkidle');

    const firstErrorText = page.getByText('Houstoooon, something went wrong!');
    await expect(firstErrorText).toBeVisible();

    const secondErrorText = page.getByText('Click below to land in IDV Suite');
    await expect(secondErrorText).toBeVisible();

    await page.locator('[data-test="error-button"]').getByText('Land here').click();
    await expect(page.locator('[data-test="filter-by-date"]')).toBeVisible();
  });
});
