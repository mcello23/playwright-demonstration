import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  globalTimeout: 80000,
  timeout: 40000,
  expect: {
    timeout: 15000,
  },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: process.env.CI ? 3 : 4,
  reporter: [
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
        screenshots: true,
      },
    ],
    ['list'],
    ['html'],
  ],
  globalSetup: './utils/global-setup.ts',
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev/',
    trace: 'on',
    storageState: './auth/loggedInState.json',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      slowMo: 200,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Webkit'],
      },
    },
  ],
});
