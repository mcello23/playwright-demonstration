import { expect, test } from '../utils/test-extend';

test.describe('Authentication flows @smoke', () => {
  test.beforeEach(async ({ page }) => {
    // await page.route('**amazoncognito.com/oauth2/**', async (route) => {
    //   const response = await route.fetch();
    //   expect(response.status()).toBe(302);
    //   await route.continue();
    // });
    await page.goto('/');
    // eslint-disable-next-line
    await page.waitForLoadState('networkidle');
  });
  test('As a user, I want to login at IDV and validate it through UI and API', async ({
    page,
  }) => {
    await expect(page.locator('[data-test="header-logo"]')).toBeVisible();
  });

  test('As a user, I want to logout from IDV and validate it through UI and API', async ({
    page,
  }) => {
    await page.locator('[data-test="user-name"]').click();
    await page.getByText('Log out').click();

    await page.waitForURL(/eu-west-2\.amazoncognito\.com/);
    expect(page.url()).toMatch(/eu-west-2\.amazoncognito\.com/);
  });
});
