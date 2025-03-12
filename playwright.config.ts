import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import * as os from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: process.env.CI ? 55_000 : 30_000,
  expect: { timeout: process.env.CI ? 40_000 : 15_000 },
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 3 : 3,
  shard: process.env.CI ? { total: 3, current: 1 } : undefined,
  fullyParallel: true,
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
    baseURL: 'https://idv-suite.identity-platform.dev/',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve(__dirname, 'auth/auth-chromium.json'),
        viewport: { width: 2560, height: 1440 },
        video: 'retain-on-failure',
        trace: 'on',
        screenshot: 'on',
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: path.resolve(__dirname, 'auth/auth-firefox.json'),
        viewport: { width: 2560, height: 1440 },
        video: 'retain-on-failure',
        trace: 'on',
        screenshot: 'on',
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: path.resolve(__dirname, 'auth/auth-webkit.json'),
        viewport: { width: 2560, height: 1440 },
        video: 'retain-on-failure',
        trace: 'on',
        screenshot: 'on',
        ignoreHTTPSErrors: true,
      },
    },
    // {
    //   name: 'edge',
    //   use: {
    //     channel: 'msedge',
    //     storageState: path.resolve(__dirname, 'auth/auth-chromium.json'),
    //     viewport: { width: 2560, height: 1440 },
    //     video: 'retain-on-failure',
    //     trace: 'on',
    //     screenshot: 'on',
    //     ignoreHTTPSErrors: true,
    //   },
    // },
  ],
});
