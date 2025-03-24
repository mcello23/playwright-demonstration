import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';
import { stepPOM, verifyDateRangeInput } from 'utils/controller/e2e';
import { getFormattedDateRange } from 'utils/helpers/calandarHelper';
import { StringsValidationBase, TextAssertion } from 'utils/helpers/miscHelper';
import { operationsTexts } from 'utils/strings/operations-row.strings';

export class operationPageCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Navigates to Operations page')
  async goesToOperations() {
    await this.page.getByRole('link', { name: 'Operations' }).click();
  }

  @stepPOM('Navigates to Operations page')
  async goesToOperationsWait() {
    await this.page.getByRole('link', { name: 'Operations' }).click();
    await this.page.waitForURL('**/operations');
  }

  @stepPOM('Validates Operations page is visible')
  async operationsHeaderVisible() {
    const operationsHeader = this.page
      .locator('[data-test="header"] div')
      .filter({ hasText: 'Operations' });
    await expect(operationsHeader).toBeVisible();
  }

  // Static elements
  // Operations row
  @stepPOM('Validate static elements visibility and interactivity')
  async validateStaticElements() {
    await expect(this.page.locator('[data-test="filter-by-date"]')).toBeVisible();
    await expect(this.page.locator('[data-test="filter-by-date"]')).toBeEnabled();
    await expect(this.page.locator('[data-test="filter-by-search"]')).toBeVisible();
    await expect(this.page.locator('[data-test="filter-by-search"]')).toBeEnabled();
    await expect(this.page.locator('[data-test="filter-button"]')).toBeVisible();
    await expect(this.page.locator('[data-test="filter-button"]')).toBeEnabled();
  }
  @stepPOM('Inserts random date on input and validates it')
  async insertsRandomDate() {
    const formattedDate = getFormattedDateRange();

    const filterByDateLocator = this.page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDate);
    await filterByDateLocator.press('Enter');
    await filterByDateLocator.focus();
    await verifyDateRangeInput(filterByDateLocator, formattedDate);
  }

  @stepPOM('Inserts random name, sees clear button, clicks it and validates input is empty')
  async insertsRandomNameOnInputSearch() {
    const randomName = faker.person.firstName();
    await this.page.locator('[data-test="filter-by-search"]').fill(randomName);
    await expect(this.page.locator('[data-test="clear-all"]')).toBeVisible();
    await this.page.locator('[data-test="clear-all"]').click();
    await expect(this.page.locator('[data-test="filter-by-search"]')).not.toHaveValue(randomName);
  }

  @stepPOM('Validates that the filter button works by selecting a label')
  async selectsFilterButtonAndLabel() {
    await this.page.locator('[data-test="filter-button"]').click();
    await this.page.getByLabel('Onboarding').click();
    const buttonChecked = this.page.locator('[data-test="filter-option-ONBOARDING"] label').first();
    await expect(buttonChecked).toHaveAttribute('aria-checked', 'true');
    await this.page.mouse.click(10, 10);
  }

  @stepPOM('Sees the "X" button is visible and clicks it')
  async clicksOnXButtonToClearInput() {
    await this.page.locator('[data-test="input-remove-value"]').isVisible();
    await this.page.locator('[data-test="input-remove-value"]').click();
    const filterByDate = this.page.locator('[data-test="filter-by-date"]');
    await expect(filterByDate).toBeEmpty();
  }

  @stepPOM('Sees the "Clear all" button is visible and clicks it')
  async clicksOnClearAllButtonToClearInput() {
    await this.page.locator('[data-test="clear-all"]').isVisible();
    await this.page.locator('[data-test="clear-all"]').click();
    const filterByDate = this.page.locator('[data-test="filter-by-date"]');
    await expect(filterByDate).toBeEmpty();
  }

  @stepPOM(
    'Validates expected Date and Time, Operation ID, Type and Onboarding Steps formats are seen in the UI'
  )
  async validatesDateOpIDTypesAndSteps() {
    // Date and time format
    const dateRegex = /^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    await expect(this.page.getByText(dateRegex).nth(0)).toBeVisible();
    // Operation ID format
    const operationIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    await expect(this.page.getByText(operationIdRegex).nth(0)).toBeVisible();
    // Type format
    const typeOnboarding = this.page.locator('[data-test="table-row-0"]').getByText('Onboarding');
    await expect(typeOnboarding).toBeVisible();
    // Onboarding steps format
    const steps = this.page
      .locator('[data-test="table-row-0"]')
      .getByRole('cell')
      .filter({ hasText: /^$/ })
      .first();
    await expect(steps).toBeVisible();
  }

  @stepPOM('Finds a rejected operation is visible')
  async findsRejectedOperation() {
    const resultsPage = this.page.locator('#tableBody');

    const rejectedRow = resultsPage
      .locator('[data-test^="table-row-"]')
      .filter({
        hasText: /Rejected|Rechazado|Rejeitado/,
      })
      .first();

    await expect(rejectedRow).toBeVisible();
  }

  @stepPOM('Validates that the error color and SVG warning are visible')
  async findsErrorColorAndSVGWarning() {
    const resultsPage = this.page.locator('#tableBody');
    const rejectedRow = resultsPage
      .locator('[data-test^="table-row-"]')
      .filter({
        hasText: /Rejected|Rechazado|Rejeitado/,
      })
      .first();

    const errorStatusElement = rejectedRow.locator(
      'span.facephi-ui-status[style*="--colors-error400"]'
    );
    await expect(errorStatusElement).toBeVisible();

    const rejectedOperationElement = rejectedRow.locator('[data-test^="operationDetail-"]').nth(1);

    await expect(rejectedOperationElement).toHaveAttribute(
      'href',
      expect.stringContaining('?tab=timeline')
    );

    await rejectedOperationElement.focus();
    await expect(rejectedOperationElement).toBeEnabled();
  }

  @stepPOM('Clicks on a operation that has assests available')
  async clicksOnFilesButton() {
    const filesButton = this.page.getByRole('button', { name: /Files \(\d+\)/ }).first();
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    await filesButton.click();
  }

  @stepPOM('Validates that the files listing is visible and contains from 1 to 6 items')
  async validatesListingAndContent() {
    const filesModal = this.page.locator('[data-test="option-menu"]');
    await expect(filesModal).toBeVisible();
    await expect(filesModal).toBeEnabled();

    const optionItems = filesModal.locator('button.facephi-ui-option-menu__item');
    const count = await optionItems.count();

    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(6);

    console.log(`Found ${count} option menu items`);
  }

  @stepPOM('Clicks on any operation')
  async clicksAnyOperation() {
    const resultsPage = this.page.locator('#tableBody');
    const successfullRow = resultsPage.locator('[data-test^="table-row-"]').nth(1);

    const successOperation = successfullRow.locator('[data-test^="operationDetail-"]');
    await successOperation.click();
    await this.page.waitForRequest('**/operations/**');
  }

  @stepPOM('Clicks on a successful operation')
  async clicksOperationSuccessful() {
    const resultsPage = this.page.locator('#tableBody');
    const successfullRow = resultsPage
      .locator('[data-test^="table-row-"]')
      .filter({
        hasText: /Successful|Exitoso|Conseguiu/,
      })
      .nth(1);

    const successOperation = successfullRow.locator('[data-test^="operationDetail-"]');
    await successOperation.click();
    await this.page.waitForRequest('**/operations/**');
  }

  @stepPOM('Clicks on a rejected operation')
  async clicksOperationRejected() {
    const resultsPage = this.page.locator('#tableBody');
    const rejectedRow = resultsPage
      .locator('[data-test^="table-row-"]')
      .filter({
        hasText: /Rejected|Rechazado|Rejeitado/,
      })
      .first();

    const errorStatusElement = rejectedRow.locator(
      'span.facephi-ui-status[style*="--colors-error400"]'
    );
    await expect(errorStatusElement).toBeVisible();

    const rejectedOperationElement = rejectedRow.locator('[data-test^="operationDetail-"]').nth(0);
    await rejectedOperationElement.click();
    await this.page.waitForRequest('**/operations/**');
  }
}
export class OperationsStringsValidation extends StringsValidationBase {
  constructor(page: Page) {
    super(page);
  }

  @stepPOM('Navigates to Operations page and locates every string')
  async navigateToOperations(locale: string) {
    await this.page.goto(`/${locale}`, { waitUntil: 'commit' });
    await this.page.locator('[data-test="Operations"]').click();
    await this.page.locator('[data-test="header"]').focus();
  }
  getOperationsAssertions(locale: string): TextAssertion[] {
    const data = (operationsTexts as OperationsTexts)[locale];
    type OperationsTexts = /*unresolved*/ any;

    return [
      {
        locator: this.page.locator('[data-test="header"]').getByText(data.title),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.startDate),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.endDate),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.userID),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.type),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.steps),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.Assets).nth(0),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.status),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.actions),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.sarted).nth(0),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.successful).nth(0),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.rejected).nth(0),
        isEnabled: false,
      },
    ];
  }

  @stepPOM('Validate that all strings are visible in the Operations page')
  async validateOperationsTexts(locale: string) {
    const assertions = this.getOperationsAssertions(locale);
    await this.validateTexts(assertions);
  }
}
