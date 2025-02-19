import { test as baseTest, expect, type Page } from '@playwright/test';
import fs from 'fs';

export * from '@playwright/test';

async function isAuthStateValid(page: Page): Promise<boolean> {
  try {
    await page.goto('https://idv-suite.identity-platform.dev/en');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-test="header-logo"]')).toBeVisible({
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}

export const test = baseTest.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use) => {
      const workerId = test.info().parallelIndex;
      const authFileName = `./auth/${workerId}.json`;

      let isValid = false;
      if (fs.existsSync(authFileName)) {
        const page: Page = await browser.newPage({
          storageState: authFileName,
        });
        isValid = await isAuthStateValid(page);
        await page.close();
      }

      if (isValid) {
        console.log(`Reusing valid authentication state from ${authFileName}`);
        await use(authFileName);
        return;
      }

      const page: Page = await browser.newPage({ storageState: undefined });
      try {
        console.log('Starting login...');

        // Navegar para a página de login
        const baseUrl = process.env.BASE_URL || 'https://idv-suite.identity-platform.dev';
        await page.goto(`${baseUrl}/`);

        // Aguardar o formulário de login
        await page.waitForLoadState('networkidle');
        const emailInput = page.getByRole('textbox', { name: 'Email address' });
        await emailInput.waitFor({ state: 'visible', timeout: 10000 });

        // Preencher email
        await emailInput.fill(process.env.USER_EMAIL ?? '');
        await page.getByRole('button', { name: 'Next' }).click();

        // Aguardar e preencher senha
        const passwordInput = page.getByRole('textbox', { name: 'Password' });
        await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        await passwordInput.fill(process.env.USER_PASSWORD ?? '');
        await page.getByRole('button', { name: 'Continue' }).click();
        console.log('Email and password set!');

        // Verificar se o elemento que indica login bem sucedido está presente
        await expect(page.locator('[data-test="header-logo"]')).toBeVisible({
          timeout: 15000,
        });

        console.log('Login sucessful!');

        // Salvar o estado da autenticação
        await page.context().storageState({ path: authFileName });
        console.log(`Auth file saved at: ${authFileName}`);

        await use(authFileName);
      } catch (error) {
        console.error('Error at login:', error);
        console.error('Actual URL:', page.url());

        // Capturar screenshot em caso de erro
        await page.screenshot({
          path: `./auth/login-error-${workerId}.png`,
          fullPage: true,
        });

        throw error;
      } finally {
        await page.close();
      }
    },
    { scope: 'worker' },
  ],
});
