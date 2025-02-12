import { expect, test } from '@playwright/test';

const loginAndValidateAPI = async (page: any) => {
  const getAggregateStatisticsPromise = page.waitForResponse(
    '**/graphql',
    async (response: any) => {
      const request = response.request();
      const postData = JSON.parse(request.postData()!);

      if (postData.operationName === 'getAggregateStatistics') {
        expect(postData).toHaveProperty(
          'operationName',
          'getAggregateStatistics',
        );
      }
      return false;
    },
  );
  await page.goto('/');

  const response = await getAggregateStatisticsPromise;
  expect(response.status()).toBe(200);
};

test.describe('Authentication flows @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndValidateAPI(page);
  });
  test('As a user, I want to login at IDV and validate it through UI and API', async ({
    page,
  }) => {
    // // eslint-disable-next-line
    // await page.waitForLoadState('networkidle');
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
