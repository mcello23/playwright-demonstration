import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: 80000,
  expect: {
    timeout: 60000,
  },
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 3 : 6,
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
        screenshots: false,
      },
    ],
    ['list'],
    ['html'],
  ],
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1920, height: 1080 },
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
