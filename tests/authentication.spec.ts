import { expect, test } from '../utils/test-extend';

test.describe('Authentication flows @smoke', () => {
  test('As a user, I login to IDV validating OpenID token request and UI', async ({
    page,
  }) => {
    await page.route('**/openid-connect/token', async (route, request) => {
      expect(request.method()).toBe('POST');

      const body = new URLSearchParams(request.postData() || '');
      expect(body.get('grant_type')).toBe('authorization_code');
      expect(body.has('code')).toBe(true);
      expect(body.has('code_verifier')).toBe(true);
      expect(body.has('client_id')).toBe(true);

      await route.continue();
    });

    await page.goto('/');
    await page.waitForLoadState('load');

    await expect(page.locator('[data-test="header-logo"]')).toBeVisible();
  });

  test('As a user, I logout from IDV validating OpenID response and UI', async ({
    page,
  }) => {
    await page.goto('/');
    // await page.waitForLoadState('networkidle');
    await page.locator('[data-test="user-name"]').click();
    await page.getByText('Log out').click();

    await page.route(
      '**/auth/realms/idv/protocol/openid-connect/auth**',
      async (route, request) => {
        console.log('Intercepted request:', request.url());
        const response = await route.fetch();
        console.log('Response:', response.url(), response.status());
        expect(response.status()).toBe(200);
        await route.continue();
      },
    );
    await page.waitForURL(/.*login.*/);
    expect(page.url()).toMatch(/.*login.*/);
  });
});
