import { expect, interceptTenantExchange, loginUnsigned, test } from '../utils/fixtures/e2e';

test.describe('Happy path: Profile and tenants validation @regression', async () => {
  test.beforeEach(async ({ page }) => {
    await page.waitForURL(/.*tenant.*/);
  });

  test('Clicks on "Profile" and sees all options @smoke', async ({ page }) => {
    await test.step('Click on user name profile', async () => {
      await page.locator('[data-test="user-name"]').click();
    });

    await test.step('Validate logout option is visible', async () => {
      const logoutOption = page.locator('[data-test="option-menu"]');
      await expect(logoutOption).toContainText('Log out');
    });
  });

  test('Clicks on the Tenant button and sees all elements available @smoke', async ({ page }) => {
    await test.step('Click on tenant button', async () => {
      await page.getByRole('button', { name: 'Demo' }).click();
    });

    await test.step('Validate tenant modal title is visible', async () => {
      const tenantText = page.getByText('Switch tenant');
      await expect(tenantText).toBeVisible();
    });

    await test.step('Validate tenant buttons and options', async () => {
      await page.locator('[data-test="modal-tenant"] button').first().isVisible();
      await page.getByRole('button', { name: 'demo idv-demo' }).isVisible();
      await page.getByRole('button', { name: 'demo idv-demo' }).isEnabled();
      await page.getByRole('button', { name: 'idv-prueba idv-prueba' }).isVisible();
      await page.getByRole('button', { name: 'idv-prueba idv-prueba' }).isEnabled();
    });

    await test.step('Validate apply button is visible but disabled', async () => {
      await page.getByRole('button', { name: 'Apply' }).isVisible();
      await page.getByRole('button', { name: 'Apply' }).isDisabled();
    });
  });

  test('Copies a Tenant and sees the toast message in UI', async ({ page }) => {
    await test.step('Open tenant modal', async () => {
      await page.getByRole('button', { name: 'Demo' }).click();
    });

    await test.step('Disable animations for testing', async () => {
      await page.addStyleTag({
        content: `* { animation: none !important; transition: none !important; }`,
      });
    });

    await test.step('Click on copy button and validate', async () => {
      const copyButton = page.locator(
        '[data-test="button-copy-809b44ff-26af-4ffc-9bb8-5dd9b0e87c44"]'
      );
      await expect(copyButton).toBeAttached();
      await copyButton.click();
    });

    await test.step('Validate toast message appears', async () => {
      const toastMessage = page.locator('[data-test="copied-value"]', {
        hasText: 'Copied to clipboard',
      });
      await expect(toastMessage).toBeVisible();
    });
  });

  test('Changes the Tenant of a user and validates through UI @smoke', async ({ page }) => {
    await test.step('Setup route interception for tenant exchange', async () => {
      await page.route('**/realms/idv/tenant-exchange', interceptTenantExchange);
    });

    await test.step('Open tenant modal', async () => {
      await page.getByRole('button', { name: 'Demo' }).click();
      const tenantText = page.getByText('Switch tenant');
      await expect(tenantText).toBeVisible();
    });

    await test.step('Select new tenant and apply changes', async () => {
      await page.getByRole('button', { name: 'idv-prueba 809b44ff-26af-4ffc' }).click();
      await page.getByRole('button', { name: 'Apply' }).click();
    });

    await test.step('Validate successful tenant change', async () => {
      await page
        .locator('[data-test="update-tenant"]', { hasText: 'Successfully changed tenant' })
        .isVisible();
      const tenantButton = page.getByRole('button', { name: 'idv-prueba' });
      await tenantButton.isVisible();
    });
  });

  test('Access a IDV URL with a different tenant associated to my user and continues to navigate', async ({
    page,
  }) => {
    await test.step('Wait for tenant URL to load', async () => {
      await page.waitForURL(/.*tenant.*/);
    });

    await test.step('Navigate to operations page with different tenant', async () => {
      await page.goto('/en/tenant/idv-prueba/operations');
    });

    await test.step('Validate operations header is visible', async () => {
      const operationsHeader = page
        .locator('[data-test="header"] div')
        .filter({ hasText: 'Operations' });
      await expect(operationsHeader).toBeVisible();
    });
  });
});

test.describe('Negative path: Profile and tenants validation @regression', () => {
  test.use({ storageState: 'auth/unsigned.json' });
  test.beforeEach(async ({ page }) => {
    loginUnsigned(page);
  });
  //TODO: add different logedin auth state for this test
  test('Access a IDV URL with a tenant not associated to my user and sees the 404 page', async ({
    page,
  }) => {
    await test.step('Navigate to tenant URL and wait for loading', async () => {
      await page.waitForURL(/.*tenant.*/);
      await page.goto('/en/tenant/idv-prueba/operations');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Validate top logo is visible', async () => {
      const topLogo = page.getByRole('img').first();
      await expect(topLogo).toBeVisible();
    });

    await test.step('Validate error elements are visible', async () => {
      const errorImage = page.getByRole('img', { name: 'Error image' });
      await expect(errorImage).toBeVisible();

      const firstErrorText = page.getByText('Houstoooon, something went wrong!');
      await expect(firstErrorText).toBeVisible();

      const secondErrorText = page.getByText('Click below to land in IDV Suite');
      await expect(secondErrorText).toBeVisible();
    });

    await test.step('Validate home button is visible and enabled', async () => {
      const homeButton = page.locator('[data-test="error-button"]').getByText('Land here');
      await expect(homeButton).toBeVisible();
      await expect(homeButton).toBeEnabled();
    });
  });

  test('Access a IDV URL with a tenant not associated to my user, sees the 404 page and returns to landing', async ({
    page,
  }) => {
    await test.step('Navigate to tenant URL and wait for loading', async () => {
      await page.waitForURL(/.*tenant.*/);
      await page.goto('/en/tenant/idv-prueba/operations');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Validate error messages are visible', async () => {
      const firstErrorText = page.getByText('Houstoooon, something went wrong!');
      await expect(firstErrorText).toBeVisible();

      const secondErrorText = page.getByText('Click below to land in IDV Suite');
      await expect(secondErrorText).toBeVisible();
    });

    await test.step('Click on Land here button and validate redirect', async () => {
      await page.locator('[data-test="error-button"]').getByText('Land here').click();
      await expect(page.locator('[data-test="filter-by-date"]')).toBeVisible();
    });
  });
});
