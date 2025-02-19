import { test as baseTest } from '@playwright/test';
import fs from 'fs';
import type { BrowserContextOptions } from 'playwright';
import { getCognitoAuthTokens } from '../cognitoAuth.ts';

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
        token = JSON.parse(fs.readFileSync(authFile, 'utf-8')).idToken;
      } else {
        token = await getCognitoAuthTokens();
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
          localStorage: [{ name: 'CognitoIdToken', value: authToken }],
        },
      ],
    };
    await use(storageState);
  },
});
