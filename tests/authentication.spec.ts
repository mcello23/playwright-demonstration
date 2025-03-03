import { Request, Route } from '@playwright/test';
import { expect, loginUnsigned, test } from '../utils/fixtures/e2e';

const unsignedStatePath = 'auth/unsigned.json';

async function validateOpenIDTokenRequest(route: Route, request: Request) {
  expect(request.method()).toBe('POST');
  console.log('Request method:', request.method());

  const body = new URLSearchParams(request.postData() || '');
  expect(body.get('grant_type')).toBe('authorization_code');
  expect(body.has('code')).toBe(true);
  expect(body.has('code_verifier')).toBe(true);
  expect(body.has('client_id')).toBe(true);

  await route.continue();
}

async function validateOpenIDAuthResponse(route: Route) {
  console.log('Intercepted request:', route.request().url());
  const response = await route.fetch();
  console.log('Response status:', response.status());
  expect(response.status()).toBe(200);
  await route.continue();
}

test.describe('Authentication @regression', () => {
  test.use({ storageState: unsignedStatePath });

  test.beforeEach(async ({ page }) => {
    await loginUnsigned(page);
  });

  test('Should login successfully and validate OpenID token @smoke', async ({ page, browserName }) => {
    console.log(`Running login test on ${browserName}`);
    await page.route('**/openid-connect/token', validateOpenIDTokenRequest);
    await expect(page.locator('[data-test="header-logo"]')).toBeVisible();
  });

  test('Should logout successfully and validate OpenID response @smoke', async ({ page }) => {
    await page.route('**/auth/realms/idv/protocol/openid-connect/auth**', validateOpenIDAuthResponse);

    await page.locator('[data-test="user-name"]').click();
    await page.getByText('Log out').click();

    await expect(page).toHaveURL(/.*login.*/);
  });
});
