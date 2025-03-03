import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, test } from '../utils/fixtures/e2e.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const unsignedStatePath = path.resolve(__dirname, '../auth/unsigned.json');

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

async function validateOpenIDAuthResponse(route: any) {
  console.log('Intercepted request:', route.request().url());
  const response = await route.fetch();
  console.log('Response status:', response.status());
  expect(response.status()).toBe(200);
  await route.continue();
}

test.describe('Authentication @regression', () => {
  test.use({ storageState: unsignedStatePath });

  test.beforeEach(async ({ page }) => {
    if (!process.env.USER_EMAIL || !process.env.USER_PASSWORD) {
      throw new Error('Env variables USER_EMAIL e USER_PASSWORD aren\'t set');
    }
    
    await page.waitForSelector('form', { state: 'visible' });
    
    const emailInput = page.getByRole('textbox', { name: 'Email address' });
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.focus();
    await emailInput.clear();
    await emailInput.fill(process.env.USER_EMAIL);

    const emailValue = await emailInput.inputValue();
    expect(emailValue).toBe(process.env.USER_EMAIL);
  
    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible' });
    await nextButton.click();

    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.focus();
    await passwordInput.clear();
    await passwordInput.fill(process.env.USER_PASSWORD);
    
    const passwordValue = await passwordInput.inputValue();
    expect(passwordValue).toBeTruthy();
  
    await page.getByRole('button', { name: 'Continue' }).click();
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
