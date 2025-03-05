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

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

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

async function loginAndSaveState(browserType: 'chromium' | 'firefox' | 'webkit') {
  const authFilePath = path.join(authDir, `auth-${browserType}.json`);

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

    const emailInput = page.getByRole('textbox', { name: 'Email address' });
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(process.env.USER_EMAIL!, { timeout: 40000 });

    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForLoadState('networkidle');

    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(process.env.USER_PASSWORD!, { timeout: 40000 });

    await page.getByRole('button', { name: 'Continue' }).click();

    await page.waitForSelector('[data-test="header-logo"]', { timeout: 20000 });

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

  if (process.env.CI) {
    const shard = config.shard;
    if (shard) {
      const { total, current } = shard;
      let browserType: 'chromium' | 'firefox' | 'webkit';

      if (total === 3) {
        if (current === 1) {
          browserType = 'chromium';
        } else if (current === 2) {
          browserType = 'firefox';
        } else {
          browserType = 'webkit';
        }
        console.log(`🔧 CI detected, executing login only for ${browserType} (shard ${current}/${total})`);
        await loginAndSaveState(browserType);
      } else {
        console.warn(
          `⚠️ Shard number (${total}) isn't support for shard optimization. Executing login for all browsers.`,
        );
        await Promise.all([loginAndSaveState('chromium'), loginAndSaveState('firefox'), loginAndSaveState('webkit')]);
      }
    } else {
      console.warn(`⚠️ Sharding not configured. Executing login for all browsers.`);
      await Promise.all([loginAndSaveState('chromium'), loginAndSaveState('firefox'), loginAndSaveState('webkit')]);
    }
  } else {
    // Perform login and save authentication state for each browser
    await Promise.all([loginAndSaveState('chromium'), loginAndSaveState('firefox'), loginAndSaveState('webkit')]);
  }

  console.log('✅ Global setup completed!');
}

export default globalSetup;
