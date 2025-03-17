import {
  expect,
  loginUnsigned,
  test,
  validateOpenIDAuthResponse,
  validateOpenIDTokenRequest,
} from '../utils/fixtures/e2e';

test.describe('Authentication @regression', () => {
  test.use({ storageState: 'auth/unsigned.json' });

  test.beforeEach(async ({ page }) => {
    await loginUnsigned(page);
  });

  test('Logs in successfully and validates the OpenID token @smoke', async ({ page }) => {
    await page.route('**/openid-connect/token', validateOpenIDTokenRequest);
    console.log('✅ All OIDC params intercepted are present');

    await expect(page.locator('[data-test="filter-by-date"]')).toBeVisible();
  });

  test('Logs out successfully and validates OpenID response @smoke', async ({ page }) => {
    await page.route(
      '**/auth/realms/idv/protocol/openid-connect/auth**',
      validateOpenIDAuthResponse
    );
    await page.locator('[data-test="user-name"]').click();
    await page.getByText('Log out').click();

    await expect(page).toHaveURL(/.*login.*/);
  });
});
