import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class operationDetailCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  // Clicks on different types of operations details
  @stepPOM('Clicks on any operation detail')
  async entersOperationDetail_Any() {
    const resultsPage = this.page.locator('#tableBody');
    const successfullRow = resultsPage.locator('[data-test^="table-row-"]').nth(1);

    const successOperation = successfullRow.locator('[data-test^="operationDetail-"]');
    await successOperation.click();
    await this.page.waitForRequest('**/operations/**');
  }

  @stepPOM('Clicks on a successful operation detail')
  async entersOperationDetail_Successful() {
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

  @stepPOM('Clicks on a rejected operation detail')
  async entersOperationDetail_Rejected() {
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

  @stepPOM('Validates all header elements are visible and in the correct format inside a Operation')
  async validatesAllHeaderElements() {
    // Upper Header buttons
    const dataButton = this.page.getByRole('button', { name: 'Data' });
    await expect(dataButton).toBeEnabled();
    await expect(dataButton).toBeVisible();
    const securityButton = this.page.getByRole('button', { name: 'Security' });
    await expect(securityButton).toBeEnabled();
    await expect(securityButton).toBeVisible();
    const ocrButton = this.page.getByRole('button', { name: 'OCR' });
    await expect(ocrButton).toBeEnabled();
    await expect(ocrButton).toBeVisible();
    const timelineButton = this.page.getByRole('button', { name: 'Timeline' });
    await expect(timelineButton).toBeEnabled();
    await expect(timelineButton).toBeVisible();
    const advancedTrackingButton = this.page.getByRole('button', { name: 'Advanced tracking' });
    await expect(advancedTrackingButton).toBeEnabled();
    await expect(advancedTrackingButton).toBeVisible();

    // Date format validation
    const dateLocator = this.page.locator('p.facephi-ui-label', { hasText: /Date:|Fecha:|Data:/ });
    await expect(dateLocator).toBeVisible();

    const dateElement = this.page
      .locator('p.facephi-ui-label', {
        hasText: /\d{2}\/\d{2}\/\d{2}/,
      })
      .first();
    const dateText = await dateElement.textContent();

    const dateRegex = /\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}/;
    expect(dateText).not.toBeNull();

    if (dateText) {
      expect(dateText.trim()).toMatch(dateRegex);
    }

    // Operation ID format validation
    const operationIdLocator = this.page.locator('p.facephi-ui-label', { hasText: 'ID:' });
    await expect(operationIdLocator).toBeVisible();

    const idTextContent = await operationIdLocator.textContent();
    expect(idTextContent).not.toBeNull();

    if (idTextContent) {
      const idRegex = /^ID:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
      const match = idTextContent.match(idRegex);
      expect(match).toBeDefined();
    }

    const endStepLocator = this.page
      .locator('p.facephi-ui-label', {
        hasText: /Start|Inicio|Começar|SelphID|Selphi|Finish|Fin|Fim/,
      })
      .nth(0);
    await expect(endStepLocator).toBeVisible();

    const operationName = this.page
      .locator('p.facephi-ui-label', {
        hasText: /Onboarding|Authentication|Autenticación|Autenticação/,
      })
      .nth(0);
    await expect(operationName).toBeVisible();

    // TODO: add other locales
    const operationStatus = this.page
      .locator('div')
      .filter({ hasText: /^Successful|Started|Rejected$/ })
      .nth(0);
    await expect(operationStatus).toBeVisible();
  }
}
