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
  workers: process.env.CI ? 1 : 6, // Reduzido workers no CI
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
    trace: 'on-first-retry',
    storageState: './auth/loggedInState.json',
    screenshot: 'on',
    video: 'retain-on-failure',
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
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          args: process.env.CI ? ['--no-sandbox', '--disable-gpu'] : [],
          firefoxUserPrefs: {
            'browser.cache.disk.enable': false,
            'browser.cache.memory.enable': false,
            'browser.cache.offline.enable': false,
            'network.http.use-cache': false,
          },
        },
        contextOptions: {
          reducedMotion: 'reduce',
          strictSelectors: true,
        },
      },
      retries: process.env.CI ? 5 : 0, // Mais retentativas para Firefox no CI
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
