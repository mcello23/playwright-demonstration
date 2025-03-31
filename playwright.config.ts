import { defineConfig, devices } from '@playwright/test';
import { Status } from 'allure-js-commons';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import * as os from 'node:os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
interface StorageStateObject {
  cookies: any[];
  origins: any[];
}

type StorageState = string | StorageStateObject;
type BrowserName = 'chromium' | 'firefox' | 'webkit';

/**
 * @param browserName -
 */
function getStorageState(browserName: BrowserName): StorageState {
  return path.resolve(__dirname, `auth/auth-${browserName}.json`);
}

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: process.env.CI ? 50_000 : 30_000,
  expect: {
    timeout: process.env.CI ? 30_000 : 18_000,
    toHaveScreenshot: { pathTemplate: 'tests/visual-tests/{arg}{ext}' },
  },
  snapshotDir: 'tests/visual-tests',
  updateSnapshots: 'all',
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
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        attachments: true,
        outputFolder: 'allure-report',
        reportName: 'IDV Suite Test Report',
        historyDir: 'allure-history',
        addAllureIdLabel: true,
        links: {
          issue: {
            pattern: 'https://facephicorporative.atlassian.net/jira/software/projects/IDVS/{}',
            nameTemplate: 'Issue #%s',
          },
          tms: {
            pattern: 'https://facephicorporative.atlassian.net/jira/software/projects/IDVS/{}',
            nameTemplate: 'TMS #%s',
          },
        },
        categories: [
          {
            name: 'Broken tests',
            messageRegex: '.*',
            matchedStatuses: [Status.FAILED, Status.BROKEN],
            flaky: true,
          },
          {
            name: 'Flaky tests',
            messageRegex: '.*',
            matchedStatuses: [Status.BROKEN],
          },
          {
            name: 'Failed tests',
            messageRegex: '.*',
            matchedStatuses: [Status.FAILED],
          },
          {
            name: 'Skipped tests',
            matchedStatuses: [Status.SKIPPED],
          },
        ],
        environmentInfo: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
          playwright_version: require('@playwright/test/package.json').version,
          environment: process.env.NODE_ENV || 'development',
          test_branch: process.env.GITHUB_REF_NAME || 'main',
          test_run_timestamp: new Date().toISOString(),
        },
        labels: [
          {
            name: 'epic',
            pattern: /\@epic:(.*)/,
          },
          {
            name: 'feature',
            pattern: /\@feature:(.*)/,
          },
          {
            name: 'story',
            pattern: /\@story:(.*)/,
          },
        ],
        plugins: ['screen-diff', 'behaviors'],
      },
    ],
  ],
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
        storageState: getStorageState('chromium'),
        video: 'retain-on-failure',
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: getStorageState('firefox'),
        video: 'retain-on-failure',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: getStorageState('webkit'),
        video: 'retain-on-failure',
      },
    },
  ],
});
