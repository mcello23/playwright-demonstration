import { chromium, firefox, FullConfig, webkit } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredEnvVars = ['USER_EMAIL', 'USER_PASSWORD', 'BASE_URL'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`❌ Missing environment variable: ${varName}`);
  }
});

const authDir = path.resolve(__dirname, '../auth');
const unsignedStatePath = path.join(authDir, 'unsigned.json');

// Ensure the authentication directory exists
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Function to create an unsigned state (logged-out state)
async function createUnsignedState() {
  if (fs.existsSync(unsignedStatePath)) {
    console.log(`⚙️ Unsigned state already exists, skipping creation.`);
    return;
  }

  console.log('⚙️ Creating unsigned state...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.BASE_URL!);
    await context.storageState({ path: unsignedStatePath });
    console.log(`✅ Unsigned state saved: ${unsignedStatePath}`);
  } catch (error) {
    console.error(`❌ Failed to create unsigned state:`, error);
  } finally {
    await browser.close();
  }
}

// Function to log in and save authentication state
async function loginAndSaveState(browserType: 'chromium' | 'firefox' | 'webkit') {
  const authFilePath = path.join(authDir, `auth-${browserType}.json`);

  // If the auth state already exists, skip login
  if (fs.existsSync(authFilePath)) {
    console.log(`🔄 Authentication state already exists for ${browserType}, skipping login.`);
    return;
  }

  console.log(`🔑 Logging in on ${browserType}...`);
  const browserTypeMap = { chromium, firefox, webkit };
  const browserLauncher = browserTypeMap[browserType];

  const browser = await browserLauncher.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.BASE_URL!);
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.USER_EMAIL!);
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.USER_PASSWORD!);
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.waitForSelector('[data-test="header-logo"]', { timeout: 15_000 });

    console.log(`✅ Login successful on ${browserType}, saving authentication state...`);
    await context.storageState({ path: authFilePath });
  } catch (error) {
    console.error(`❌ Failed to log in on ${browserType}:`, error);
  } finally {
    await browser.close();
  }
}

// Global setup function
async function globalSetup(config: FullConfig) {
  console.log(`[${new Date().toISOString()}] ⚙️ Running global setup...`);

  // Create unsigned state
  await createUnsignedState();

  // Perform login and save authentication state for each browser
  await Promise.all([loginAndSaveState('chromium'), loginAndSaveState('firefox'), loginAndSaveState('webkit')]);

  console.log('✅ Global setup completed!');
}

export default globalSetup;
