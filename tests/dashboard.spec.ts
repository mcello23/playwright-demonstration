import { expect, getFormattedDateRange, interceptGetAggreate, test, verifyDateRangeInput } from '../utils/fixtures/e2e';

test.describe('Dashboard validation flows @regression', () => {
  test('As a user, I want to insert random dates in the dashboard filter and validate via UI', async ({ page }) => {
    const chartsDashboard = page.locator('.echarts-for-react');
    await page.route('**/graphql', async (route, request) => {
      await interceptGetAggreate(route, request);
    });

    const formattedDate = getFormattedDateRange();

    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDate);
    await filterByDateLocator.press('Enter');
    expect(chartsDashboard).toBeTruthy();
    await verifyDateRangeInput(filterByDateLocator, formattedDate);
  });

  test('As a user, I want to click on the Dashboard buttons filters and validate API payload and UI', async ({
    page,
  }) => {
    const chartsDashboard = page.locator('.echarts-for-react');
    await page.route('**/graphql', async (route, request) => {
      await interceptGetAggreate(route, request);
    });

    await page.getByRole('checkbox', { name: 'hours' }).click();
    await expect(page.getByRole('checkbox', { name: 'hours' })).toHaveAttribute('aria-checked', 'true');
    expect(chartsDashboard).toHaveCount(2);

    await page.getByRole('checkbox', { name: '7 days' }).click();
    await expect(page.getByRole('checkbox', { name: '7 days' })).toHaveAttribute('aria-checked', 'true');
    await page.waitForEvent('requestfinished');
    expect(chartsDashboard).toHaveCount(3);

    await page.getByRole('checkbox', { name: '30 days' }).click();
    await expect(page.getByRole('checkbox', { name: '30 days' })).toHaveAttribute('aria-checked', 'true');
    await page.waitForEvent('requestfinished');
    expect(chartsDashboard).toHaveCount(3);
  });
});

//TODO: Add more tests
// Create spec for Operations and validate Buttons and elements
