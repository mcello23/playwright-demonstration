import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 3 : 3,
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
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 2560, height: 1440 },
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
