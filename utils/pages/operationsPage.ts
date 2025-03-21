import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';
import { StringsValidationBase, TextAssertion } from 'utils/helpers/miscHelper';
import { operationsTexts } from 'utils/strings/operations-row.strings';

export class operationPageCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Validates Operations page is visible')
  async operationsHeaderVisible() {
    const operationsHeader = this.page
      .locator('[data-test="header"] div')
      .filter({ hasText: 'Operations' });
    await expect(operationsHeader).toBeVisible();
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
