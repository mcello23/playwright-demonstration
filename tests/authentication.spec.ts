import { expect, test } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unsignedStatePath = path.resolve(__dirname, '../auth/unsigned.json');

// Função para validar requisição do token OpenID
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

// Função para validar resposta de autenticação OpenID
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
    await page.goto('/');
    const emailInput = page.getByRole('textbox', { name: 'Email address' });
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(process.env.USER_EMAIL!, { timeout: 40000 });

    await page.getByRole('button', { name: 'Next' }).click();

    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(process.env.USER_PASSWORD!, { timeout: 40000 });

    await page.getByRole('button', { name: 'Continue' }).click();
  });

  test('Should login successfully and validate OpenID token @smoke', async ({ page, browserName }) => {
    console.log(`Running login test on ${browserName}`);

    // Intercepta e valida token request
    await page.route('**/openid-connect/token', validateOpenIDTokenRequest);

    // Valida sucesso do login
    await expect(page.locator('[data-test="header-logo"]')).toBeVisible();
  });

  test('Should logout successfully and validate OpenID response @smoke', async ({ page }) => {
    // Intercepta e valida auth response
    await page.route('**/auth/realms/idv/protocol/openid-connect/auth**', validateOpenIDAuthResponse);

    // Executa logout
    await page.locator('[data-test="user-name"]').click();
    await page.getByText('Log out').click();

    // Valida redirecionamento para página de login
    await expect(page).toHaveURL(/.*login.*/);
  });
});
