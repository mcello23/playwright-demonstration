import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import * as os from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: process.env.CI ? 60_000 : 30_000,
  expect: { timeout: process.env.CI ? 35_000 : 14_000 },
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
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
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
  metadata: {
    gitcommit: 'generate',
  },
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
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
