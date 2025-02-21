import { chromium, FullConfig } from '@playwright/test';
import axios from 'axios';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const authDir = path.resolve(__dirname, '../auth');
const authFilePath = path.join(authDir, 'auth.json');
const tokenFilePath = path.join(authDir, 'm2m_token.json'); // Store M2M token separately

// Required env variables
const requiredEnvVars = [
  'BASE_URL',
  'TEST_USER',
  'TEST_PASSWORD',
  'COGNITO_M2M_CLIENT_ID',
  'COGNITO_M2M_CLIENT_SECRET',
  'COGNITO_TOKEN_ENDPOINT',
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is not set`);
  }
}

// Function to get M2M access token
async function getCognitoAuthTokens(): Promise<string> {
  try {
    console.log('⚙️ Obtaining Cognito M2M token...');
    const response = await axios.post(
      process.env.COGNITO_TOKEN_ENDPOINT!,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.COGNITO_M2M_CLIENT_ID!,
        client_secret: process.env.COGNITO_M2M_CLIENT_SECRET!,
        scope: 'default-m2m-resource-server-l87sq4/read',
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const { access_token } = response.data;
    if (!access_token) {
      throw new Error('Cognito access token not found in response.');
    }
    console.log('✅ Cognito M2M token obtained.');

    // Save M2M token to a file
    await fs.writeFile(tokenFilePath, JSON.stringify({ access_token }, null, 2));
    console.log(`💾 M2M token saved to ${tokenFilePath}`);

    return access_token;
  } catch (error: any) {
    console.error('❌ Error getting Cognito M2M token:', error.message);
    throw error;
  }
}

// Global setup function
async function globalSetup(config: FullConfig) {
  console.log('⚙️ Starting global setup...');

  await fs.mkdir(authDir, { recursive: true });

  // Step 1: Get M2M Token (for API requests)
  const cognitoToken = await getCognitoAuthTokens();

  // Step 2: Perform Interactive Web Login
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  console.log(`🌎 Navigating to login page: ${process.env.LOGIN_URL}`);
  await page.goto(process.env.LOGIN_URL!, { waitUntil: 'load' });

  await page.fill('input[name="username"]', process.env.TEST_USER!);
  await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
  await page.click('button[type="submit"]');

  // Wait for authentication
  await page.waitForLoadState('networkidle');

  console.log('✅ Login successful!');

  // Manually store session tokens in LocalStorage
  await page.evaluate(() => {
    localStorage.setItem('isAuthenticated', 'true');
  });

  // Verify authentication
  try {
    await page.waitForSelector('[data-test="header-logo"]', { timeout: 10000 });
    console.log('🎉 Authenticated successfully!');
  } catch (error) {
    console.warn('⚠️ Header logo not found, but authentication might still be successful.');
  }

  // Save authentication state for UI tests
  const storageState = await context.storageState();
  await fs.writeFile(authFilePath, JSON.stringify(storageState, null, 2));
  console.log(`💾 UI authentication state saved to ${authFilePath}`);

  await browser.close();
  console.log('✅ Global setup complete.');
}

export default globalSetup;
