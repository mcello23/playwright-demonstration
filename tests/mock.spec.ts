import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Authentication with Dynamically Updated Mocked Storage State @regression', () => {
  const storageStatePath = path.resolve(__dirname, '../utils/fixtures/mockedStorageState.json');
  test('As a user, I can log in with a dynamically updated mocked storage state @smoke', async ({ page }) => {
    // 1. Read the existing mockedStorageState.json
    let storageState: { cookies: any[]; origins: any[] } = { cookies: [], origins: [] };
    if (fs.existsSync(storageStatePath)) {
      const storageStateJson = fs.readFileSync(storageStatePath, 'utf-8');
      storageState = JSON.parse(storageStateJson);
    }

    // 2. Dynamically update the storage state (e.g., update a cookie value)
    const authSessionCookie = storageState.cookies.find((cookie) => cookie.name === 'AUTH_SESSION_ID');
    if (authSessionCookie) {
      authSessionCookie.value = `dynamic_session_id_${Date.now()}`; // Update the session ID
    } else {
      // Handle the case where the cookie doesn't exist
      console.warn('AUTH_SESSION_ID cookie not found in mockedStorageState.json');
    }

    // Add or modify localStorage
    const origin = storageState.origins.find((o) => o.origin === 'https://idv-suite.identity-platform.dev') || {
      origin: 'https://idv-suite.identity-platform.dev',
      localStorage: [],
    };
    const newLocalStorageItem = {
      name: 'my_custom_local_storage_item',
      value: `my_custom_local_storage_value_${Date.now()}`,
    };
    origin.localStorage.push(newLocalStorageItem);

    if (!storageState.origins.find((o) => o.origin === 'https://idv-suite.identity-platform.dev')) {
      storageState.origins.push(origin);
    }

    // 3. Save the updated storage state back to mockedStorageState.json
    fs.writeFileSync(storageStatePath, JSON.stringify(storageState, null, 2));

    // 4. Load the page, which should now be logged in due to the updated storage state
    await page.goto('/');

    // 5. Assert that the user is logged in (check for the header logo)
    await expect(page.locator('[data-test="header-logo"]')).toBeVisible({ timeout: 15_000 });
  });
});
