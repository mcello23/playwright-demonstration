import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authDir = path.resolve(__dirname, '../auth');

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

async function globalSetup(config: FullConfig) {
  console.log('⚙️ Running global setup...');
  const numberOfWorkers = config.workers;

  for (let i = 0; i < numberOfWorkers; i++) {
    const authFilePath = path.join(authDir, `worker-${i}.json`);

    if (fs.existsSync(authFilePath)) {
      console.log(`✅ Worker ${i} reusing existing authentication state.`);
      continue;
    }

    console.log(`🔑 Logging in for worker ${i}...`);
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      const baseUrl = process.env.BASE_URL || 'https://idv-suite.identity-platform.dev';
      await page.goto(`${baseUrl}/`);

      // Login steps
      await page.waitForLoadState('networkidle');
      await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.USER_EMAIL ?? '');
      await page.getByRole('button', { name: 'Next' }).click();

      await page.getByRole('textbox', { name: 'Password' }).fill(process.env.USER_PASSWORD ?? '');
      await page.getByRole('button', { name: 'Continue' }).click();

      await page.waitForSelector('[data-test="header-logo"]', { timeout: 15000 });

      console.log(`✅ Login successful for worker ${i}. Saving authentication state...`);
      await page.context().storageState({ path: authFilePath });
    } catch (error) {
      console.error(`❌ Login failed for worker ${i}:`, error);
    } finally {
      await browser.close();
    }
  }
}

export default globalSetup;
