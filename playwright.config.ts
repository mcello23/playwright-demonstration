import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import * as os from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const authDir = path.resolve(__dirname, 'auth');

// Ensure auth directory exists
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

export default defineConfig({
  timeout: process.env.CI ? 80_000 : 30_000,
  expect: { timeout: process.env.CI ? 60_000 : 14_000 },
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 3,
  shard: process.env.CI ? { total: 3, current: 1 } : undefined,
  fullyParallel: false,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
        attachments: true,
        labels: true,
        links: true,
        video: true,
        screenshots: true,
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
        categories: [
          {
            name: 'API failures',
            messageRegex: '.*API request failed.*',
            matchedStatuses: ['failed'],
          },
          {
            name: 'UI failures',
            traceRegex: '.*Element not found.*',
            matchedStatuses: ['broken'],
          },
        ],
        executor: {
          name: 'playwright',
          type: 'playwright',
          url: process.env.CI_JOB_URL || 'local',
          buildName: process.env.CI_JOB_ID || `Local run ${new Date().toISOString()}`,
          reportName: 'Playwright Tests Execution',
        },
      },
    ],
  ],
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev',
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, 'auth/auth-chromium.json'),
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: path.resolve(__dirname, 'auth/auth-firefox.json'),
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: path.resolve(__dirname, 'auth/auth-webkit.json'),
      },
    },
  ],
});
