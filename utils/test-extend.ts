import { test as baseTest } from '@playwright/test';
import { promises as fs } from 'fs';
import type { BrowserContextOptions } from 'playwright';
import { getCognitoAuthTokens } from '../cognitoAuth.ts';

export * from '@playwright/test';

interface TestOptions {
  storageState: BrowserContextOptions['storageState'];
}

export const test = baseTest.extend<TestOptions, { authToken: string }>({
  authToken: [
    async ({}, use) => {
      const authFile = './auth/auth.json';
      let token: string;
      try {
        // Tenta ler o token salvo de forma assíncrona
        const fileContent = await fs.readFile(authFile, 'utf-8');
        const parsed = JSON.parse(fileContent);
        token = parsed.idToken;
      } catch (error) {
        // Se não for possível ler o arquivo ou o token estiver inválido, refaz a autenticação
        token = await getCognitoAuthTokens();
      }
      await use(token);
    },
    { scope: 'worker' },
  ],
  storageState: async ({ authToken }, use) => {
    const storageState: BrowserContextOptions['storageState'] = {
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
