import { expect, test } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unsignedStatePath = path.resolve(__dirname, '../auth/unsigned.json');

// Function to validate OpenID token request
async function validateOpenIDTokenRequest(route: any, request: any) {
  expect(request.method()).toBe('POST');
  console.log('Request method:', request.method());

  const postData = request.postData();
  const body = new URLSearchParams(postData);
  expect(body.get('grant_type')).toBe('authorization_code');
  expect(body.has('code')).toBe(true);
  expect(body.has('code_verifier')).toBe(true);
  expect(body.has('client_id')).toBe(true);

  await route.continue();
}

// Function to validate OpenID auth response
async function validateOpenIDAuthResponse(route: any) {
  console.log('Intercepted request:', route.request().url());
  const response = await route.fetch();
  console.log('Response status:', response.status());
  expect(response.status()).toBe(200);
  await route.continue();
}

// Authentication test suite
test.describe('Authentication flows @regression', () => {
  test.use({ storageState: unsignedStatePath });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const maskedEmail = process.env.USER_EMAIL ? '***' : '';
    console.log(`Filling email address: ${maskedEmail}`);
    await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.USER_EMAIL_1 ?? '');
    await page.getByRole('button', { name: 'Next' }).click();

    const maskedPassword = process.env.USER_PASSWORD ? '***' : '';
    console.log(`Filling password: ${maskedPassword}`);
    await page.getByRole('textbox', { name: 'Password' }).pressSequentially(process.env.USER_PASSWORD_1 ?? '');
    await page.getByRole('button', { name: 'Continue' }).click();
  });

  test('As a user, I log in to IDV validating OpenID token request and UI @smoke', async ({ page }) => {
    await page.route('**/openid-connect/token', async (route, request) => {
      await validateOpenIDTokenRequest(route, request);
    });

    await expect(page.locator('[data-test="header-logo"]')).toBeVisible();
  });

  test('As a user, I log out from IDV validating OpenID response and UI @smoke', async ({ page }) => {
    await page.route('**/auth/realms/idv/protocol/openid-connect/auth**', async (route) => {
      await validateOpenIDAuthResponse(route);
    });

    await page.locator('[data-test="user-name"]').click();
    await page.getByText('Log out').click();

    await expect(page).toHaveURL(/.*login.*/);
  });
});
