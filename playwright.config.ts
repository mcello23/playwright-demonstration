import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const globalSetupPath = path.resolve(__dirname, 'utils/global-setup.ts');
const authDir = path.resolve(__dirname, 'auth');

import fs from 'fs';
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

export default defineConfig({
  timeout: 80000,
  expect: {
    timeout: 60000,
  },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 4 : 4,
  reporter: [
    ['list'],
    ['html'],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'test-results',
        suiteTitle: true,
        attachments: true,
        labels: true,
        links: true,
        video: true,
        screenshots: false,
      },
    ],
  ],
  globalSetup: globalSetupPath,
  use: {
    baseURL: process.env.BASE_URL || 'https://idv-suite.identity-platform.dev',
    trace: process.env.CI ? 'retain-on-failure' : 'on',
    screenshot: process.env.CI ? 'only-on-failure' : 'on',
    video: process.env.CI ? 'retain-on-failure' : 'on',
    viewport: { width: 1920, height: 1080 },
    storageState: path.resolve(authDir, `worker-${process.env.PLAYWRIGHT_WORKER_INDEX || 0}.json`),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }, // or 'msedge-dev'
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});
