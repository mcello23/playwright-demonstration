import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  globalSetup: require.resolve('./utils/global-setup'),
  globalTimeout: process.env.CI ? 60000 : 30000, // Aumentado timeout no CI
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
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
        screenshots: true,
      },
    ],
    ['list'],
    ['html'],
  ],
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev/',
    trace: 'on',
    storageState: './auth/loggedInState.json',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1920, height: 1080 },
    actionTimeout: process.env.CI ? 15000 : 5000,
    navigationTimeout: process.env.CI ? 30000 : 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          args: process.env.CI ? ['--no-sandbox'] : [],
        },
        contextOptions: {
          reducedMotion: 'reduce',
          strictSelectors: true,
        },
        actionTimeout: process.env.CI ? 30000 : 15000,
        navigationTimeout: process.env.CI ? 45000 : 30000,
      },
      retries: process.env.CI ? 5 : 0,
    },
  ],
});
