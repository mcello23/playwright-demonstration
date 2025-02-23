import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL!;
const AUTH_SESSION_ID = process.env.AUTH_SESSION_ID!;
const KEYCLOAK_IDENTITY = process.env.KEYCLOAK_IDENTITY!;
const KEYCLOAK_SESSION = process.env.KEYCLOAK_SESSION!;

async function globalSetup() {
  console.log('Starting globalSetup...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Setting cookies...');
    await context.addCookies([
      {
        name: 'AUTH_SESSION_ID',
        value: AUTH_SESSION_ID,
        domain: 'idp.identity-platform.dev',
        path: '/auth/realms/idv/',
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      },
      {
        name: 'KEYCLOAK_IDENTITY',
        value: KEYCLOAK_IDENTITY,
        domain: 'idp.identity-platform.dev',
        path: '/auth/realms/idv/',
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      },
      {
        name: 'KEYCLOAK_SESSION',
        value: KEYCLOAK_SESSION,
        domain: 'idp.identity-platform.dev',
        path: '/auth/realms/idv/',
        httpOnly: false,
        secure: true,
        sameSite: 'None',
      },
    ]);

    console.log('Navigating to base URL...');
    await page.goto(BASE_URL);

    console.log('Saving Playwright session state...');
    await context.storageState({ path: 'storageState.json' });
    console.log('Storage state saved successfully.');
  } catch (error) {
    console.error('Error during setup:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
