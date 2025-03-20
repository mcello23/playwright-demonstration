import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class operationPageCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
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
