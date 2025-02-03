import { chromium, expect } from '@playwright/test';
import fs, { rmSync } from 'fs';
import path, { join } from 'path';

async function globalSetup() {
  // Auth files
  const authFile = path.join(__dirname, '../auth/loggedInState.json');
  const unAuthFile = path.join(__dirname, '../auth/notLoggedInState.json');

  // Allure clean up
  try {
    const allureResultsPath = join(__dirname, '../allure-results');
    const allureReportPath = join(__dirname, '../allure-report');

    // Config for CI
    if (fs.existsSync(allureResultsPath)) {
      rmSync(allureResultsPath, { recursive: true, force: true });
    }
    if (fs.existsSync(allureReportPath)) {
      rmSync(allureReportPath, { recursive: true, force: true });
    }
  } catch (error: unknown) {
    console.log('Allure folder not found:', error);
  }

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
    await emailField.fill(process.env.USER_EMAIL!);

    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible' });
    await nextButton.click();

    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await passwordField.waitFor({ state: 'visible' });
    await passwordField.fill(process.env.USER_PASSWORD!);
    await passwordField.press('Enter');

    await page.waitForURL('**/en');
    await expect(page).toHaveURL('https://idv-suite.identity-platform.dev/en');
    await expect(page).toHaveTitle(/IDV Suite/);

    await page.context().storageState({ path: authFile });
    await browser.close();
  } catch (error) {
    console.error('Error at global setup:', error);
    throw error;
  }
}

export default globalSetup;
