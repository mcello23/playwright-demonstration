import { expect, test } from '@playwright/test';

async function validateOpenIDTokenRequest(route: any, request: any) {
  expect(request.method()).toBe('POST');
  console.log('Request method:', request.method());

  const body = new URLSearchParams(request.postData() || '');
  expect(body.get('grant_type')).toBe('authorization_code');
  expect(body.has('code')).toBe(true);
  expect(body.has('code_verifier')).toBe(true);
  expect(body.has('client_id')).toBe(true);

  await route.continue();
}

async function validateOpenIDAuthResponse(route: any) {
  console.log('Intercepted request:', route.request().url());
  const response = await route.fetch();
  console.log('Response status:', response.status());
  expect(response.status()).toBe(200);
  await route.continue();
}

test.describe('Authentication flows @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('As a user, I login to IDV validating OpenID token request and UI @smoke', async ({ page }) => {
    await page.route('**/openid-connect/token', async (route, request) => {
      await validateOpenIDTokenRequest(route, request);
    });

    await page.waitForLoadState('load');

    await expect(page.locator('[data-test="header-logo"]')).toBeVisible();
  });

  test('As a user, I logout from IDV validating OpenID response and UI @smoke', async ({ page }) => {
    await page.locator('[data-test="user-name"]').click();
    await page.getByText('Log out').click();

    await page.route('**/auth/realms/idv/protocol/openid-connect/auth**', async (route) => {
      await validateOpenIDAuthResponse(route);
    });
    await page.waitForURL(/.*login.*/);
    expect(page.url()).toMatch(/.*login.*/);
  });
});
