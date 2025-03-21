import { Page, expect } from '@playwright/test';
import { stepPOM, verifyDateRangeInput } from 'utils/controller/e2e';
import { getFormattedDateRange } from 'utils/helpers/calandarHelper';
import { StringsValidationBase, TextAssertion } from 'utils/helpers/stringsHelper';
import { dashboardTexts } from 'utils/strings/dashboard.strings';

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

  @stepPOM('Clicks on 24 hours button filter and validates RSC responses')
  async clicksHoursButtonAndValidatesRSC(apiHelpers: any) {
    await this.hourCheckbox.click();
    await expect(this.hourCheckbox).toHaveAttribute('aria-checked', 'true');
    await apiHelpers.waitForMultipleRSCResponses(2);
  }

  @stepPOM('Validates Echarts responses on UI')
  async validatesUIDashboardResponse() {
    const count = await this.chartsDashboard.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(3);
  }

  @stepPOM('Clicks on 7 days button filter and validates RSC responses')
  async clicks7DaysButtonAndValidatesRSC(apiHelpers: any) {
    await this.sevenDaysCheckbox.click();
    await expect(this.sevenDaysCheckbox).toHaveAttribute('aria-checked', 'true');
    await apiHelpers.waitForMultipleRSCResponses(2);
  }

  @stepPOM('Clicks on 30 days filter and validates RSC responses')
  async clicks30DaysButtonAndValidatesRSC(apiHelpers: any) {
    await this.thirtyDaysCheckbox.click();
    await expect(this.thirtyDaysCheckbox).toHaveAttribute('aria-checked', 'true');
    await apiHelpers.waitForMultipleRSCResponses(2);
  }

  @stepPOM('Validates Echarts responses on UI')
  async validatesUIDashboard30days() {
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
export class DashboardStringsValidation extends StringsValidationBase {
  constructor(page: Page) {
    super(page);
  }

  @stepPOM('Navigates to Dashboard page and locates every string')
  async navigateToDashboard(locale: string) {
    await this.page.goto(`/${locale}`, { waitUntil: 'commit' });
    await this.page.locator('[data-test="header-logo"]').click();
  }

  getDashboardAssertions(locale: string): TextAssertion[] {
    const data = (dashboardTexts as DashboardTexts)[locale];
    type DashboardTexts = /*unresolved*/ any;

    return [
      // Upper section
      {
        locator: this.page.getByRole('checkbox', { name: data.hours }),
        isEnabled: false,
      },
      {
        locator: this.page.getByRole('checkbox', { name: data.sevenDays }),
        isEnabled: false,
      },
      {
        locator: this.page.getByRole('checkbox', { name: data.thirtyDays }),
        isEnabled: false,
      },
      {
        locator: this.page.locator('[data-test="filter-by-date"]'),
        isEnabled: true,
      },
      // Middle section
      { locator: this.page.getByText(data.newOnboardings), isEnabled: false },
      { locator: this.page.getByText(data.authentications), isEnabled: false },
      {
        locator: this.page.getByText(data.onboardings, { exact: true }),
        isEnabled: false,
      },
      { locator: this.page.getByText(data.successRate), isEnabled: false },
      { locator: this.page.getByText(data.errorRate), isEnabled: false },
      { locator: this.page.getByText(data.allOperations), isEnabled: false },
      // Bottom section
      { locator: this.page.getByText(data.succeeded), isEnabled: false },
      { locator: this.page.getByText(data.started), isEnabled: false },
      { locator: this.page.getByText(data.expired), isEnabled: false },
      { locator: this.page.getByText(data.cancelled), isEnabled: false },
      { locator: this.page.getByText(data.blocked), isEnabled: false },
      { locator: this.page.getByText(data.denied), isEnabled: false },
      {
        locator: this.page.getByText(data.error, { exact: true }),
        isEnabled: false,
      },
    ];
  }

  @stepPOM('Validate that all strings are visible in the Dashboard page')
  async validateDashboardTexts(locale: string) {
    const assertions = this.getDashboardAssertions(locale);
    await this.validateTexts(assertions);
  }
}
