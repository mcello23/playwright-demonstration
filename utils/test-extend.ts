import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';

export const test = baseTest.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use) => {
      const workerId = test.info().parallelIndex;
      const authFileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${workerId}.json`,
      );

      if (fs.existsSync(authFileName)) {
        console.log(`Reusing authentication state from ${authFileName}`);
        await use(authFileName);
        return;
      }

      const page = await browser.newPage({ storageState: undefined });
      try {
        console.log('Iniciando processo de login...');

        // Navegar para a página de login
        const baseUrl =
          process.env.BASE_URL || 'https://idv-suite.identity-platform.dev';
        await page.goto(`${baseUrl}/en`);
        console.log('Página carregada:', page.url());

        // Aguardar o formulário de login
        await page.waitForLoadState('networkidle');
        const emailInput = page.getByRole('textbox', { name: 'Email address' });
        await emailInput.waitFor({ state: 'visible', timeout: 10000 });

        // Preencher email
        console.log('Preenchendo email:', process.env.USER_EMAIL);
        await emailInput.fill(process.env.USER_EMAIL ?? '');
        await page.getByRole('button', { name: 'Next' }).click();

        // Aguardar e preencher senha
        const passwordInput = page.getByRole('textbox', { name: 'Password' });
        await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
        await passwordInput.fill(process.env.USER_PASSWORD ?? '');

        // Clicar em login e aguardar navegação
        await page.getByRole('button', { name: 'Continue' }).click();

        // Verificar se o login foi bem sucedido
        await page.waitForURL('**/en', { timeout: 15000 });

        // Verificar se o elemento que indica login bem sucedido está presente
        await expect(page.locator('[data-test="header-logo"]')).toBeVisible({
          timeout: 15000,
        });

        console.log('Login realizado com sucesso!');

        // Salvar o estado da autenticação
        await page.context().storageState({ path: authFileName });
        console.log(`Estado de autenticação salvo em: ${authFileName}`);

        await use(authFileName);
      } catch (error) {
        console.error('Erro durante o processo de login:', error);
        console.error('URL atual:', page.url());

        // Capturar screenshot em caso de erro
        await page.screenshot({
          path: `login-error-${workerId}.png`,
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
