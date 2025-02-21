import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Define authentication storage paths
const authDir = path.resolve(__dirname, 'auth');
const unsignedStatePath = path.join(authDir, 'unsigned.json');

// Ensure auth directory exists
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
  console.log(`✅ Auth directory created: ${authDir}`);
}

// Optimize workers for CI and local execution
const numWorkers = process.env.CI ? Math.min(os.cpus().length, 2) : 3;

// Function to retrieve the correct storage state file
const getStorageStatePath = (workerIndex: number) => {
  const workerStatePath = path.join(authDir, `worker-${workerIndex}.json`);
  return fs.existsSync(workerStatePath) ? workerStatePath : unsignedStatePath;
};

export default defineConfig({
  timeout: 30_000, // 30s test timeout
  expect: { timeout: 14_000 }, // 14s expectation timeout
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1, // More retries in CI
  workers: numWorkers,
  reporter: [
    ['list'],
    ['html'],
    [
      'allure-playwright',
      {
        outputFolder: 'test-results',
        detail: true,
        suiteTitle: true,
        attachments: true,
        labels: true,
        links: true,
        video: true,
        screenshots: false,
      },
    ],
  ],
  globalSetup: path.resolve(__dirname, 'utils/global-setup.ts'),
  use: {
    baseURL: 'https://idv-suite.identity-platform.dev',
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on',
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    storageState: getStorageStatePath(parseInt(process.env.PLAYWRIGHT_WORKER_INDEX || '0', 10)),
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox'],
        },
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
        ...devices['Desktop Safari'],
      },
    },
  ],
});
