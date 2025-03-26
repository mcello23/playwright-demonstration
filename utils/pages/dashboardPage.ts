import { Page, expect } from '@playwright/test';
import { stepPOM, verifyDateRangeInput } from 'utils/controller/e2e';
import { getFormattedDateRange } from 'utils/helpers/calandarHelper';
import { StringsValidationBase, TextAssertion } from 'utils/helpers/miscHelper';
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

  @stepPOM('Loads main page after login')
  async loadsMainURL() {
    await this.page.waitForURL(/.*tenant.*/);
    const filterElement = this.page.locator('[data-test="filter-by-date"]');
    await expect(filterElement).toBeVisible();
  }

  // Profile
  @stepPOM('Clicks on user name and sees profile options')
  async seesProfileOptions() {
    await this.page.locator('[data-test="user-name"]').click();
    const logoutOption = this.page.locator('[data-test="option-menu"]');
    await expect(logoutOption).toContainText('Log out');
  }

  @stepPOM('Clicks on logout button')
  async clicksLogout() {
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

  // Input fields and Echarts
  @stepPOM('Fills the date input with random date')
  async fillDateInputWithRandomDate() {
    const formattedDate = getFormattedDateRange();
    await this.filterByDateLocator.fill(formattedDate);
    await this.filterByDateLocator.press('Enter');
    return formattedDate;
  }

  @stepPOM('Validates the UI charts after filter change')
  async validateChartsVisibility() {
    await this.page.waitForSelector('.echarts-for-react', { timeout: 10000 });

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

  @stepPOM('Fills date input with random date and validates its value')
  async fillAndValidateRandomDate() {
    const formattedDate = await this.fillDateInputWithRandomDate();
    await this.validateDateRangeFilter(formattedDate);
    return formattedDate;
  }

  // Tenant modal
  @stepPOM('Clicks on the Tenant button and sees all elements available')
  async clicksTenantButtonAndSeesElements() {
    await this.page.getByRole('button', { name: 'demo' }).click();
    const tenantText = this.page.getByText('Switch tenant');
    await expect(tenantText).toBeVisible();
    await this.page.locator('[data-test="modal-tenant"] button').first().isVisible();
    await this.page.getByRole('button', { name: 'demo idv-demo' }).isVisible();
    await this.page.getByRole('button', { name: 'demo idv-demo' }).isEnabled();
    await this.page.getByRole('button', { name: 'idv-prueba idv-prueba' }).isVisible();
    await this.page.getByRole('button', { name: 'idv-prueba idv-prueba' }).isEnabled();
    await this.page.getByRole('textbox', { name: 'Search tenant' }).isVisible();
  }

  @stepPOM('Opens tenant modal')
  async openTenantModal() {
    await this.page.getByRole('button', { name: 'demo' }).click();
    await this.page.addStyleTag({
      content: `* { animation: none !important; transition: none !important; }`,
    });
  }

  @stepPOM('Selects copy tenant and validates toast message in UI')
  async copiesTenantAndSeesToast() {
    const copyButton = this.page.locator(
      '[data-test="button-copy-809b44ff-26af-4ffc-9bb8-5dd9b0e87c44"]'
    );
    await expect(copyButton).toBeAttached();
    await copyButton.click();
    const toastMessage = this.page.locator('[data-test="copied-value"]', {
      hasText: 'Copied to clipboard',
    });
    await expect(toastMessage).toBeVisible();
  }

  @stepPOM('Changes the Tenant of a user and validates through UI')
  async changesTenantAndValidatesUI() {
    await this.page.getByRole('button', { name: 'idv-prueba 809b44ff-26af-4ffc' }).click();
    await this.page
      .locator('[data-test="update-tenant"]', { hasText: 'Successfully changed tenant' })
      .isVisible();

    const tenantButton = this.page.getByRole('button', { name: 'idv-prueba' });
    await tenantButton.isVisible();
  }

  @stepPOM('Validates the tenant change in the URL')
  async goesToURLWithDifferentTenant() {
    await this.page.waitForURL(/.*tenant.*/);
    await this.page.goto('/en/tenant/idv-prueba/operations', { waitUntil: 'commit' });
  }

  // Accessibility
  @stepPOM('Validates all Aria attributes in the Dashboard page')
  async seesAriaAttributesDashboard() {
    await expect(this.page.locator('[data-test="header"]')).toMatchAriaSnapshot(`
      - paragraph: Dashboard
      - button "demo":
        - paragraph: demo
        - img
      - button "marcelocosta@facephi.com":
        - img
        - paragraph: marcelocosta@facephi.com
        - img
    `);

    await expect(this.page.getByRole('main')).toMatchAriaSnapshot(`
      - main:
        - paragraph: Dashboard
        - button "demo":
          - paragraph: demo
          - img
        - button "marcelocosta@facephi.com":
          - img
          - paragraph: marcelocosta@facephi.com
          - img
        - button:
          - img
        - textbox "Filter by date": /\\d+\\/\\d+\\/\\d+ - \\d+\\/\\d+\\/\\d+/
        - checkbox /\\d+ hours/
        - checkbox "7 days" [checked]
        - checkbox /\\d+ days/
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: "0"
        - paragraph: Authentications
        - img
        - paragraph: "0"
        - paragraph: Onboardings
        - paragraph: All operations (%)
        - paragraph: Succesful
        - paragraph: Started
        - paragraph: Expired
        - paragraph: Cancelled
        - paragraph: Blocked
        - paragraph: Rejected
        - paragraph: Error
        - paragraph: Success rate
        - paragraph
        - paragraph: Error rate
        - paragraph
    `);

    await expect(this.page.locator('body')).toMatchAriaSnapshot(
      `
      - alert
      - link:
        - img
      - list:
        - listitem:
          - link "Dashboard":
            - img
            - paragraph: Dashboard
        - listitem:
          - link "Operations":
            - img
            - paragraph: Operations
      - list:
        - img
        - paragraph: Operations
        - button "Application":
          - img
          - paragraph: Application
      - main:
        - paragraph: Dashboard
        - button "demo":
          - paragraph: demo
          - img
        - button "marcelocosta@facephi.com":
          - img
          - paragraph: marcelocosta@facephi.com
          - img
        - button:
          - img
        - textbox "Filter by date": /\\d+\\/\\d+\\/\\d+ - \\d+\\/\\d+\\/\\d+/
        - checkbox /\\d+ hours/
        - checkbox "7 days" [checked]
        - checkbox /\\d+ days/
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: "0"
        - paragraph: Authentications
        - img
        - paragraph: "0"
        - paragraph: Onboardings
        - paragraph: All operations (%)
        - paragraph: Succesful
        - paragraph: Started
        - paragraph: Expired
        - paragraph: Cancelled
        - paragraph: Blocked
        - paragraph: Rejected
        - paragraph: Error
        - paragraph: Success rate
        - paragraph
        - paragraph: Error rate
        - paragraph
      - region "Notifications alt+T"
    `
    );
  }
  @stepPOM('Compares Aria content with UI screenshots')
  async comparesAriaSnapshotScreenshots(browserName: string) {
    await expect(this.page.getByRole('main')).toHaveScreenshot(
      `dashboard-main-content-${browserName}.png`
    );

    await expect(this.page.locator('body')).toHaveScreenshot(
      `dashboard-sidebar-${browserName}.png`
    );
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
