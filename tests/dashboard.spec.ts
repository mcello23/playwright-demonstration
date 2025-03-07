import {
  expect,
  getFormattedDateRange,
  test,
  verifyDateRangeInput,
  waitForMultipleRSCResponses,
} from '../utils/fixtures/e2e';

test.describe('Dashboard validation flows @regression', () => {
  test('Inserts random dates in the dashboard filter and validates via UI', async ({ page }) => {
    const chartsDashboard = page.locator('.echarts-for-react');
    const formattedDate = getFormattedDateRange();
    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');

    await waitForMultipleRSCResponses(page, 2);

    await filterByDateLocator.fill(formattedDate);
    await filterByDateLocator.press('Enter');

    expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
    expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);

    await verifyDateRangeInput(filterByDateLocator, formattedDate);
  });

  test('Clicks on the Dashboard buttons filters and validates RSC request and Echarts in UI', async ({
    page,
  }) => {
    const chartsDashboard = page.locator('.echarts-for-react');

    await page.getByRole('checkbox', { name: 'hours' }).click();
    await expect(page.getByRole('checkbox', { name: 'hours' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    await waitForMultipleRSCResponses(page, 2);
    expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
    expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);

    await page.getByRole('checkbox', { name: '7 days' }).click();
    await expect(page.getByRole('checkbox', { name: '7 days' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    await waitForMultipleRSCResponses(page, 2);
    expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
    expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);

    await page.getByRole('checkbox', { name: '30 days' }).click();
    await expect(page.getByRole('checkbox', { name: '30 days' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    await waitForMultipleRSCResponses(page, 2);
    const canva = page
      .locator('section')
      .filter({ hasText: 'All operations (%)' })
      .locator('canvas');
    await expect(canva).toBeVisible();
    expect(chartsDashboard).toHaveCount(3);
  });

  test('Uses the calendar pop-up and validates all RSC requests and Echarts in UI', async ({
    page,
  }) => {
    await page.getByRole('button').nth(3).click();

    const calendar = page.locator('.facephi-ui-portal__container');
    const selectStartDate = page.locator('td button.rdp-day_button', { hasText: '3' }).nth(0);
    const selectEndDate = page.locator('td button.rdp-day_button', { hasText: '25' }).nth(0);
    const chartsDashboard = page.locator('.echarts-for-react');

    await expect(calendar).toBeVisible();

    await selectStartDate.click();
    await selectEndDate.click();
    await calendar.focus();
    await waitForMultipleRSCResponses(page, 2);

    expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
    expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);
  });
});
