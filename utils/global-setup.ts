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
  console.log('⚙️ Creating unsigned state...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.BASE_URL!, { waitUntil: 'domcontentloaded' });
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

  console.log(`🔑 Starting login with ${browserType}...`);
  const browserTypeMap = { chromium, firefox, webkit };
  const browserLauncher = browserTypeMap[browserType];

  const browser = await browserLauncher.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.BASE_URL!, { waitUntil: 'commit' });

    const emailInput = page.getByRole('textbox', { name: 'Email address' });
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(process.env.USER_EMAIL!, { timeout: 40000 });

    await page.getByRole('button', { name: 'Next' }).click();

    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.fill(process.env.USER_PASSWORD!, { timeout: 40000 });
    await page.getByRole('button', { name: 'Continue' }).click();

    try {
      await page.waitForURL('**/tenant/**', { waitUntil: 'commit' });

      console.log(`✅ Login successful with ${browserType}! Saving state...`);
      await context.storageState({ path: authFilePath });
    } catch (error) {
      console.error(`❌ Login with ${browserType} failed! Issue: ${error}`);
      await page.screenshot({ path: path.join(authDir, `redirect-fail-${browserType}.png`) });
    }

    // Failsafe
    const imageError = page.getByRole('img', { name: 'Error image' });
    const errorHeader = page.getByText('Sorry, aliens have stolen our server');

    const isErrorImageVisible = await imageError.isVisible().catch(() => false);
    const isErrorHeaderVisible = await errorHeader.isVisible().catch(() => false);

    if (isErrorImageVisible || isErrorHeaderVisible) {
      console.error(`⛔ Cookies error detected with ${browserType} login`);
      await page.screenshot({ path: path.join(authDir, `error-${browserType}.png`) });
      throw new Error(`Login error when using ${browserType} to login`);
    }
  } catch (error) {
    await browser.close();
  }
}

async function handleBrowsersBasedOnSharding(config: FullConfig) {
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
      console.log(`🔧 Executing login only for ${browserType} (shard ${current}/${total})`);
      await loginAndSaveState(browserType);
    } else {
      console.warn(
        `⚠️ Shard number (${total}) isn't supported for shard optimization. Executing login for all browsers.`
      );
      await Promise.all([
        loginAndSaveState('chromium'),
        loginAndSaveState('firefox'),
        loginAndSaveState('webkit'),
      ]);
    }
  } else {
    console.log(`⚙️ No sharding configured. Executing login for all browsers.`);
    await Promise.all([
      loginAndSaveState('chromium'),
      loginAndSaveState('firefox'),
      loginAndSaveState('webkit'),
    ]);
  }
}

async function globalSetup(config: FullConfig) {
  console.log(`[${new Date().toISOString()}] ⚙️ Running global setup...`);

  await createUnsignedState();

  await handleBrowsersBasedOnSharding(config);

  console.log('✅ Global setup completed!');
}

export default globalSetup;
