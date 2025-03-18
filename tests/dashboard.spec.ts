import {
  CalendarHelper,
  description,
  expect,
  getFormattedDateRange,
  tags,
  test,
  verifyDateRangeInput,
  waitForMultipleRSCResponses,
} from '../utils/fixtures/e2e';

test.describe('Dashboard validation flows @regression', () => {
  test('Inserts random dates in the dashboard filter and validates via UI', async ({ page }) => {
    tags('Dashboard', 'Echarts', 'Filter by date input');
    description(
      'This test uses the Filter by date input using random dates and validates the RSC response as well as the UI.'
    );

    const chartsDashboard = page.locator('.echarts-for-react');
    const formattedDate = getFormattedDateRange();
    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');

    await test.step('Validates the exepcted RSC responses from NextJS', async () => {
      await waitForMultipleRSCResponses(page, 2);
    });

    await test.step('Fills the date input randomly', async () => {
      await filterByDateLocator.fill(formattedDate);
      await filterByDateLocator.press('Enter');
    });

    await test.step('Validates the UI (Echarts) after the RSC response', async () => {
      expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
      expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);

      await verifyDateRangeInput(filterByDateLocator, formattedDate);
    });
  });

  test('Clicks on the Dashboard buttons filters and validates RSC request and Echarts in UI', async ({
    page,
  }) => {
    tags('Dashboard', 'Echarts', 'Date buttons');
    description(
      'This test clicks on every checkbox of the Dashboard, validates UI (Echarts response), as well as RSC responses.'
    );

    const chartsDashboard = page.locator('.echarts-for-react');

    await test.step('Validaates the exepcted UI and RSC responses from 24h button', async () => {
      await page.getByRole('checkbox', { name: 'hours' }).click();
      await expect(page.getByRole('checkbox', { name: 'hours' })).toHaveAttribute(
        'aria-checked',
        'true'
      );
      await waitForMultipleRSCResponses(page, 2);
      expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
      expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);
    });

    await test.step('Validaates the exepcted UI and RSC responses from 7 days button', async () => {
      await page.getByRole('checkbox', { name: '7 days' }).click();
      await expect(page.getByRole('checkbox', { name: '7 days' })).toHaveAttribute(
        'aria-checked',
        'true'
      );
      await waitForMultipleRSCResponses(page, 2);
      expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
      expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);
    });

    await test.step('Validaates the exepcted UI and RSC responses from 30 days button', async () => {
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
  });

  test('Uses the calendar pop-up and validates all RSC requests and Echarts in UI', async ({
    page,
  }) => {
    tags('Calendar', 'Echarts', 'Date picker');
    description(
      'This test clicks randomly on calendar dates, validates UI (Echarts response), as well as RSC responses.'
    );

    await test.step('Opens the calendar and selects a random date range', async () => {
      const calendar = new CalendarHelper(page);
      calendar.opensCalendar();
      await calendar.goToPreviousMonth();
      await calendar.selectRandomDateRange();
    });

    await test.step('Validates the exepcted RSC responses from NextJS', async () => {
      await waitForMultipleRSCResponses(page, 2);

      const chartsDashboard = page.locator('.echarts-for-react');
      expect(await chartsDashboard.count()).toBeGreaterThanOrEqual(2);
      expect(await chartsDashboard.count()).toBeLessThanOrEqual(3);
    });
  });
});
