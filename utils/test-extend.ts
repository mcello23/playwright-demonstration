// test-extend.ts
import type { BrowserContextOptions } from '@playwright/test';
import { test as baseTest } from '@playwright/test';
import fs from 'fs';
import { authenticateWithKeycloak } from '../cognitoAuth.ts';

export * from '@playwright/test';

interface TestOptions {
  storageState: BrowserContextOptions['storageState'];
}

export const test = baseTest.extend<TestOptions, { authToken: string }>({
  authToken: [
    async ({}, use) => {
      let token = '';
      const authFile = './auth/auth.json';

      if (fs.existsSync(authFile)) {
        token = JSON.parse(fs.readFileSync(authFile, 'utf-8')).accessToken;
      } else {
        token = await authenticateWithKeycloak();
      }

      await use(token);
    },
    { scope: 'worker' },
  ],
  storageState: async ({ authToken }, use) => {
    const storageState = {
      cookies: [],
      origins: [
        {
          origin: 'https://idv-suite.identity-platform.dev',
          localStorage: [{ name: 'accessToken', value: authToken }],
        },
      ],
    };
    await use(storageState);
  },
});
