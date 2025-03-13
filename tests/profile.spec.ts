import { expect, interceptTenantExchange, test } from '../utils/fixtures/e2e';

test.describe('Profile and tenants validation @regression', async () => {
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
});
// TODO: Test for accesing 2nd tenant directly if not checked
