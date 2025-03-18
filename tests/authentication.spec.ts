import {
  description,
  expect,
  loginUnsigned,
  tags,
  test,
  validateOpenIDAuthResponse,
  validateOpenIDTokenRequest,
} from '../utils/fixtures/e2e';

test.describe('Authentication @regression', async () => {
  test.use({ storageState: 'auth/unsigned.json' });

  test.beforeEach(async ({ page }) => {
    await loginUnsigned(page);
  });

  test('Logs in successfully and validates the OpenID token @smoke', async ({ page }) => {
    tags('Login', 'OpenID Params');
    description(
      'Validation of Login flow, using an Unsigned state, intercepting OpenID token and validating UI elements in landing page.'
    );

    await test.step('Intercepts OpenID token parameters', async () => {
      await page.route('**/openid-connect/token', validateOpenIDTokenRequest);
      console.log('✅ Login OIDC params intercepted');
    });

    await test.step('Loads IDV main page', async () => {
      await page.waitForURL(/.*tenant.*/);
    });

    await test.step('Sees the filter date input', async () => {
      await expect(page.locator('[data-test="filter-by-date"]')).toBeVisible();
    });
  });

  test('Logs out successfully and validates OpenID response @smoke', async ({ page }) => {
    tags('Logout', 'OpenID Params');
    description('Validation of Logout flow, intercepting OpenID response and login page.');

    await test.step('Loads IDV main page', async () => {
      await page.waitForURL(/.*tenant.*/);
    });

    await test.step('Logs out', async () => {
      await page.locator('[data-test="user-name"]').click();
      await page.getByText('Log out').click();
    });

    await test.step('Intercepts logout OpenID auth response', async () => {
      await page.route(
        '**/auth/realms/idv/protocol/openid-connect/auth**',
        validateOpenIDAuthResponse
      );
      console.log('✅ Logout OIDC response intercepted');
    });

    await test.step('Sees the login page', async () => {
      await expect(page).toHaveURL(/.*login.*/);
      await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    });
  });
});
