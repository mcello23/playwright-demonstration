import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: process.env.CI ? 35_000 : 25_000,
  expect: {
    timeout: process.env.CI ? 30_000 : 15_000,
    toHaveScreenshot: { pathTemplate: 'tests/visual-tests/{arg}{ext}' },
  },
  snapshotDir: 'tests/visual-tests',
  updateSnapshots: 'changed',
  updateSourceMethod: 'patch',
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
      },
    ],
  ],
  metadata: {
    gitcommit: 'generate',
  },
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev/',
    viewport: { width: 1280, height: 720 },
    trace: 'on',
    screenshot: 'on',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, 'auth/auth-chromium.json'),
        video: 'retain-on-failure',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: path.resolve(__dirname, 'auth/auth-firefox.json'),
        video: 'retain-on-failure',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: path.resolve(__dirname, 'auth/auth-webkit.json'),
        video: 'retain-on-failure',
      },
    },
  ],
});
