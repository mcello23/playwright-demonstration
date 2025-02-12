import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('Running global setup...');

  const authFile = path.join(config.rootDir, 'auth/loggedInState.json');
  const unAuthFile = path.join(config.rootDir, 'auth/notLoggedInState.json');

  const allureResultsPath = path.join(config.rootDir, 'allure-results');
  const allureReportPath = path.join(config.rootDir, 'allure-report');

  // Cleanup Allure reports
  await cleanupAllure(allureResultsPath, allureReportPath);

  // Ensure auth directory exists
  if (!fs.existsSync(path.dirname(authFile))) {
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
  }

  // Authenticate and save state
  await authenticateAndSaveState(authFile, unAuthFile);

  console.log('Global setup completed.');
}

async function cleanupAllure(resultsPath: string, reportPath: string) {
  try {
    if (fs.existsSync(resultsPath)) {
      fs.rmSync(resultsPath, { recursive: true, force: true });
      console.log(`Deleted Allure results directory: ${resultsPath}`);
    }
    if (fs.existsSync(reportPath)) {
      fs.rmSync(reportPath, { recursive: true, force: true });
      console.log(`Deleted Allure report directory: ${reportPath}`);
    }
  } catch (error) {
    console.warn('Error cleaning Allure directories:', error);
  }
}

async function authenticateAndSaveState(authFile: string, unAuthFile: string) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(
      process.env.BASE_URL || 'https://idv-suite.identity-platform.dev/en',
    );

    // Save unauthenticated state
    await page.context().storageState({ path: unAuthFile });
    console.log(`Unauthenticated state saved to ${unAuthFile}`);

    // Perform login
    const emailField = page.getByRole('textbox', { name: 'Email address' });
    await emailField.waitFor({ state: 'visible' });
    await emailField.fill(process.env.USER_EMAIL ?? '');

    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible' });
    await nextButton.click();

    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await passwordField.waitFor({ state: 'visible' });
    await passwordField.fill(process.env.USER_PASSWORD ?? '');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Save authenticated state
    await page.waitForURL(process.env.LOGIN_REDIRECT_URL || '**/en');
    await page.context().storageState({ path: authFile });
    console.log(`Authenticated state saved to ${authFile}`);
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
