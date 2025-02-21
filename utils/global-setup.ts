import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const authDir = path.resolve(__dirname, '../auth');
const unsignedStatePath = path.join(authDir, 'unsigned.json'); // Store unsigned state

// Validate required environment variables
const requiredEnvVars = ['BASE_URL', 'USER_EMAIL', 'USER_PASSWORD'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`❌ Missing environment variable: ${varName}`);
  }
});

// Ensure auth directory exists
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Function to create unsigned state (logged-out state)
async function createUnsignedState() {
  console.log('⚙️ Creating unsigned state...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Visit the base URL (ensuring no authentication is triggered)
    await page.goto(process.env.BASE_URL!);

    // Save the unsigned state (empty session)
    await context.storageState({ path: unsignedStatePath });
    console.log(`✅ Unsigned state saved at: ${unsignedStatePath}`);
  } catch (error) {
    console.error(`❌ Failed to create unsigned state:`, error);
  } finally {
    await browser.close();
  }
}

// Function to log in and save auth state
async function loginAndSaveState(workerIndex: number, browser: any) {
  const authFilePath = path.join(authDir, `worker-${workerIndex}.json`);

  if (fs.existsSync(authFilePath)) {
    console.log(`✅ [Worker ${workerIndex}] Reusing existing authentication state.`);
    return;
  }

  console.log(`🔑 [Worker ${workerIndex}] Logging in...`);
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.BASE_URL!);
    await page.waitForLoadState('networkidle');

    await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.USER_EMAIL!);
    await page.getByRole('button', { name: 'Next' }).click();

    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.USER_PASSWORD!);
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.waitForSelector('[data-test="header-logo"]', { timeout: 15_000 });

    console.log(`✅ [Worker ${workerIndex}] Login successful! Saving authentication state...`);
    await context.storageState({ path: authFilePath });
  } catch (error) {
    console.error(`❌ [Worker ${workerIndex}] Login failed:`, error);
  } finally {
    await context.close();
  }
}

// Global setup function
async function globalSetup(config: FullConfig) {
  console.log(`[${new Date().toISOString()}] ⚙️ Running global setup...`);
  const numberOfWorkers = config.workers;

  // Create unsigned state first
  await createUnsignedState();

  // Use a single browser instance for efficiency
  const browser = await chromium.launch({ headless: process.env.CI ? true : true });

  // Perform login for each worker
  const loginPromises = [];
  for (let i = 0; i < numberOfWorkers; i++) {
    loginPromises.push(loginAndSaveState(i, browser));
  }
  await Promise.all(loginPromises);

  await browser.close();
}

export default globalSetup;
