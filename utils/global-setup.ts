import { chromium, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  const authFile = path.join(process.cwd(), 'auth/loggedInState.json');
  const unAuthFile = path.join(process.cwd(), 'auth/notLoggedInState.json');

  // Limpar diretórios Allure
  const allureResultsPath = path.join(process.cwd(), 'allure-results');
  const allureReportPath = path.join(process.cwd(), 'allure-report');

  try {
    if (fs.existsSync(allureResultsPath)) {
      fs.rmSync(allureResultsPath, { recursive: true, force: true });
    }
    if (fs.existsSync(allureReportPath)) {
      fs.rmSync(allureReportPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.log('Diretórios Allure não encontrados:', error);
  }

  // Criar diretório auth se não existir
  if (!fs.existsSync(path.dirname(authFile))) {
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
  }

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('https://idv-suite.identity-platform.dev/en');
    await page.context().storageState({ path: unAuthFile });

    const emailField = page.getByRole('textbox', { name: 'Email address' });
    await emailField.waitFor({ state: 'visible' });
    await emailField.fill(process.env.USER_EMAIL ?? '');

    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible' });
    await nextButton.click();

    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await passwordField.waitFor({ state: 'visible' });
    await passwordField.fill(process.env.USER_PASSWORD ?? '');
    await passwordField.press('Enter');

    await page.waitForURL('**/en');
    await expect(page).toHaveURL('https://idv-suite.identity-platform.dev/en');
    await expect(page).toHaveTitle(/IDV Suite/);

    await page.context().storageState({ path: authFile });
    await browser.close();
  } catch (error) {
    console.error('Erro no setup global:', error);
    throw error;
  }
}

export default globalSetup;
