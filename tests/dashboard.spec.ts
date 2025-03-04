import { expect, getFormattedDateRange, interceptGetAggreate, test, verifyDateRangeInput } from '../utils/fixtures/e2e';

test.describe('Dashboard validation flows @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/graphql', interceptGetAggreate);
  });

  test('Inserts random dates in the dashboard filter and validates via UI', async ({ page }) => {
    const chartsDashboard = page.locator('.echarts-for-react');

    const formattedDate = getFormattedDateRange();

    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDate);
    await filterByDateLocator.press('Enter');
    expect(chartsDashboard).toBeTruthy();
    await verifyDateRangeInput(filterByDateLocator, formattedDate);
  });

  test('Clicks on the Dashboard buttons filters and validates API payload and UI', async ({
    page,
  }) => {
    const chartsDashboard = page.locator('.echarts-for-react');

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

  test('Presses "X" on the date filter and sees the GraphQL call', async ({ page }) => {
    await page.locator('[data-test="input-remove-value"]').click();
    await page.waitForEvent('requestfinished');
  });

  test('Sees the calendar pop-up', async ({ page }) => {
    await page.getByRole('button').nth(3).click();
    
    const calendar = page.locator('.facephi-ui-portal__container');
    await expect(calendar).toBeVisible();

    const prevButton = calendar.locator('button.rdp-button_previous');
    expect(prevButton).toBeTruthy();
    
    const nextButton = calendar.locator('button.rdp-button_next');
    expect(nextButton).toBeTruthy();
    
    const captionLabel = calendar.locator('span.rdp-caption_label');
    expect(captionLabel).toBeTruthy();
  
    const weekdays = calendar.locator('span.rdp-weekday');
    expect(weekdays).toBeTruthy();

    const weeks = calendar.locator('tr.rdp-weeks');
    expect(weeks).toBeTruthy();

  });
});