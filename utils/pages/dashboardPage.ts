import { Page, expect } from '@playwright/test';
import { stepPOM, verifyDateRangeInput } from 'utils/controller/e2e';
import { getFormattedDateRange } from 'utils/helpers/calandarHelper';

export class dashboardCommands {
  page: Page;

  // Locators
  private get chartsDashboard() {
    return this.page.locator('.echarts-for-react');
  }
  private get filterByDateLocator() {
    return this.page.locator('[data-test="filter-by-date"]');
  }
  private get hourCheckbox() {
    return this.page.getByRole('checkbox', { name: 'hours' });
  }
  private get sevenDaysCheckbox() {
    return this.page.getByRole('checkbox', { name: '7 days' });
  }
  private get thirtyDaysCheckbox() {
    return this.page.getByRole('checkbox', { name: '30 days' });
  }
  private get operationsCanvas() {
    return this.page.locator('section').filter({ hasText: 'All operations (%)' }).locator('canvas');
  }

  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Clicks on logout button')
  async logout() {
    await this.page.locator('[data-test="user-name"]').click();
    await this.page.getByText('Log out').click();
  }

  @stepPOM('Validates Dashboard elements page')
  async seesFilterDate() {
    await expect(this.page.locator('[data-test="input-container"]')).toBeVisible();
    await expect(this.page.locator('[data-test="option-time-1"]')).toBeVisible();
    await expect(this.page.locator('[data-test="filter-by-date"]')).toBeVisible();
    await expect(this.page.locator('[data-test="new-onboardings"]')).toBeVisible();
    // Failsafe
    await expect(this.page.getByRole('img', { name: 'Error image' })).not.toBeVisible({
      timeout: 1000,
    });
    await expect(this.page.getByText('Sorry, aliens have stolen our server')).not.toBeVisible({
      timeout: 1000,
    });
  }

  @stepPOM('Fills the date input with random date')
  async fillDateInputWithRandomDate() {
    const formattedDate = getFormattedDateRange();
    await this.filterByDateLocator.fill(formattedDate);
    await this.filterByDateLocator.press('Enter');
    return formattedDate;
  }

  @stepPOM('Validates the UI charts after filter change')
  async validateChartsVisibility() {
    const count = await this.chartsDashboard.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(3);
  }

  @stepPOM('Validates the date range filter value')
  async validateDateRangeFilter(formattedDate: string) {
    await verifyDateRangeInput(this.filterByDateLocator, formattedDate);
  }

  @stepPOM('Clicks on 24 hours filter and validates UI')
  async selectHoursFilterAndValidate(apiHelpers: any) {
    await this.hourCheckbox.click();
    await expect(this.hourCheckbox).toHaveAttribute('aria-checked', 'true');
    await apiHelpers.waitForMultipleRSCResponses(2);

    const count = await this.chartsDashboard.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(3);
  }

  @stepPOM('Clicks on 7 days filter and validates UI')
  async selectSevenDaysFilterAndValidate(apiHelpers: any) {
    await this.sevenDaysCheckbox.click();
    await expect(this.sevenDaysCheckbox).toHaveAttribute('aria-checked', 'true');
    await apiHelpers.waitForMultipleRSCResponses(2);

    const count = await this.chartsDashboard.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(3);
  }

  @stepPOM('Clicks on 30 days filter and validates UI')
  async selectThirtyDaysFilterAndValidate(apiHelpers: any) {
    await this.thirtyDaysCheckbox.click();
    await expect(this.thirtyDaysCheckbox).toHaveAttribute('aria-checked', 'true');
    await apiHelpers.waitForMultipleRSCResponses(2);

    await expect(this.operationsCanvas).toBeVisible();
    expect(this.chartsDashboard).toHaveCount(3);
  }

  @stepPOM('Validates charts after calendar selection')
  async validateChartsAfterCalendarSelection(apiHelpers: any) {
    await apiHelpers.waitForMultipleRSCResponses(1);

    const count = await this.chartsDashboard.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(3);
  }
}
