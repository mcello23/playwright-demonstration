import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class operationDetailCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Clicks on any operation detail')
  async entersOperationDetail_Any() {
    const resultsPage = this.page.locator('#tableBody');
    const successfullRow = resultsPage.locator('[data-test^="table-row-"]').first();

    const successOperation = successfullRow.locator('[data-test^="operationDetail-"]');
    await successOperation.click();
    await this.page.waitForRequest('**/operations/**');
  }

  @stepPOM('Clicks on a successful operation detail')
  async entersOperationDetail_Successful() {
    const maxPagesToCheck = 3;
    let currentPage = 1;
    let foundSuccessfulOperation = false;
    const maxRetries = 3;

    while (currentPage <= maxPagesToCheck && !foundSuccessfulOperation) {
      console.log(`Verifying page ${currentPage} for successful operations...`);

      if (currentPage > 1) {
        const currentUrl = this.page.url();
        const baseUrl = currentUrl.split('?')[0];
        let retryCount = 0;
        let navigationSuccessful = false;

        while (retryCount < maxRetries && !navigationSuccessful) {
          try {
            await this.page.goto(`${baseUrl}/operations?page=${currentPage}`);
            await this.page.waitForSelector('#tableBody', { state: 'visible' });
            navigationSuccessful = true;
          } catch (error) {
            console.error(
              `Navigation to page ${currentPage} failed (attempt ${retryCount + 1}): ${error}`
            );
            retryCount++;
            await this.page.waitForTimeout(1000);
          }
        }
      }

      const resultsPage = this.page.locator('#tableBody');
      const successfulRows = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({ hasText: /Successful|Exitoso|Conseguiu/ });

      const count = await successfulRows.count();

      if (count > 0) {
        foundSuccessfulOperation = true;
        const successfulRow = count > 1 ? successfulRows.nth(1) : successfulRows.first();
        const successOperation = successfulRow.locator('[data-test^="operationDetail-"]');
        await successOperation.click();
        await this.page.waitForRequest('**/operations/**');
      } else {
        currentPage++;
      }
    }
  }

  @stepPOM('Clicks on a rejected operation detail')
  async entersOperationDetail_Rejected() {
    const maxPagesToCheck = 3;
    let currentPage = 1;
    let foundRejectedOperation = false;
    const maxRetries = 3;

    while (currentPage <= maxPagesToCheck && !foundRejectedOperation) {
      console.log(`Verifying page ${currentPage} for rejected operations...`);

      if (currentPage > 1) {
        const currentUrl = this.page.url();
        const baseUrl = currentUrl.split('?')[0];
        let retryCount = 0;
        let navigationSuccessful = false;

        while (retryCount < maxRetries && !navigationSuccessful) {
          try {
            await this.page.goto(`${baseUrl}/operations?page=${currentPage}`);
            await this.page.waitForSelector('#tableBody', { state: 'visible' });
            navigationSuccessful = true;
          } catch (error) {
            console.error(
              `Navigation to page ${currentPage} failed (attempt ${retryCount + 1}): ${error}`
            );
            retryCount++;

            await this.page.waitForTimeout(1000);
          }
        }
      }

      const resultsPage = this.page.locator('#tableBody');
      const rejectedRows = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({ hasText: /Rejected|Rechazado|Rejeitado/ });

      const count = await rejectedRows.count();

      if (count > 0) {
        foundRejectedOperation = true;
        const rejectedRow = count > 1 ? rejectedRows.nth(1) : rejectedRows.first();

        const errorStatusElement = rejectedRow.locator(
          'span.facephi-ui-status[style*="--colors-error400"]'
        );
        await expect(errorStatusElement).toBeVisible();

        const rejectedOperationElement = rejectedRow
          .locator('[data-test^="operationDetail-"]')
          .first();
        await rejectedOperationElement.click();
        await this.page.waitForRequest('**/operations/**');
      } else {
        currentPage++;
      }
    }
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
    const operationIdLocator = this.page.locator('p.facephi-ui-label', { hasText: 'User:' });
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

  @stepPOM('Validates the successful status messages and icons')
  async validatesSuccessfulStatusIcons() {
    const successfulStepMessage = this.page.getByText('Successful step');
    await expect(successfulStepMessage).toBeVisible();

    const successIcon = this.page
      .locator('div.facephi-ui-icon-wrapper[style*="--colors-success400"]')
      .nth(0);
    await expect(successIcon).toBeVisible();
  }

  @stepPOM('Validates timeline header and items')
  async validatesTimelineItems() {
    const timelineHeader = this.page.locator('div.facephi-ui-card__header', {
      hasText: 'Timeline',
    });
    await expect(timelineHeader).toBeVisible();

    const expectedTimelineItems = ['Document', 'Face', 'Security Checks', 'Finish'];

    for (const item of expectedTimelineItems) {
      const timelineItem = this.page
        .locator('div', {
          hasText: new RegExp(`^${item}$`),
        })
        .first();

      await expect(timelineItem).toBeVisible();
      console.log(`✅ "${item}" is visible in Timeline`);
    }
  }

  @stepPOM('Validates error styling and messages')
  async validatesErrorStatusIcons() {
    const errorDiv = this.page.locator('div.facephi-ui-flex[style*="--colors-error400"]').first();
    await expect(errorDiv).toBeVisible();

    const errorMessage = this.page.locator('div', { hasText: /^Failed step/ }).first();
    await expect(errorMessage).toBeVisible();

    const errorContainer = this.page.locator('div:has-text("Failed step")').first();
    const errorIcon = errorContainer
      .locator('div[class*="icon-wrapper"], div[class*="IconWrapper"]')
      .first();
    await expect(errorIcon).toBeVisible();
  }

  @stepPOM('Validates session status message')
  async validatesSuccessHeader() {
    const sessionPassedMessage = this.page.getByText(
      /This session has passed the following tests:/
    );
    await expect(sessionPassedMessage).toBeVisible();
  }

  @stepPOM('Validate selfie and document images')
  async validatesSelfieAndDocs() {
    const selfieImage = this.page
      .getByRole('figure')
      .filter({ hasText: 'Selfie' })
      .getByRole('img');
    await expect(selfieImage).toBeVisible();

    const selfieDocumentContainer = this.page
      .locator('figure', { hasText: 'Document image' })
      .getByRole('img');
    await expect(selfieDocumentContainer).toBeVisible();
  }

  @stepPOM('Validates success strings in the ID verification section')
  async validatesSuccessStrings() {
    const firstText = this.page.getByText('The person in the document and selfie match');
    await expect(firstText).toBeVisible();

    const belowText = this.page.getByText('Passive liveness');
    await expect(belowText).toBeVisible();

    const nationalityText = this.page.getByText('Nationality and geolocation match');
    await expect(nationalityText).toBeVisible();

    const scoreText = this.page.getByText(/Score:\s*\d+\.\d+%/);
    await expect(scoreText).toBeVisible();
  }

  @stepPOM('Validates ID Verification section')
  async validatesIDVerificationSection() {
    const idVerificationSection = this.page.getByText('ID Verification').first();
    await expect(idVerificationSection).toBeVisible();

    const idImages = this.page
      .locator('img')
      .filter({
        has: this.page.getByText('ID Verification'),
      })
      .or(this.page.locator('div:near(:text("ID Verification")) img'));
    const count = await idImages.count();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(count).toBeLessThanOrEqual(4);
  }

  @stepPOM('Validates collapsable elements functionality')
  async validatesCollapsableElements() {
    await this.page.locator('[data-test="collapsable-button"]').first().click();
    const collapsable = this.page.locator('button.facephi-ui-option-menu__item');
    const countCollapsable = await collapsable.count();
    expect(countCollapsable).toBeGreaterThanOrEqual(1);
    expect(countCollapsable).toBeLessThanOrEqual(6);

    await this.page.locator('[data-test="collapsable-button"]').last().click();
    const collapsableSelphi = this.page.getByRole('listitem').filter({ hasText: 'Selfie' });
    expect(collapsableSelphi).toBeVisible();
    expect(collapsableSelphi).toBeEnabled();
  }

  // OCR section
  @stepPOM('Goes to OCR section inside a operation')
  async entersOCRSection() {
    await this.page.getByRole('button', { name: 'OCR' }).click();
  }

  @stepPOM('Validates main section headings')
  async validatesMainSectionHeadings() {
    const expectedMainTexts = ['Document front', 'Document back', 'Scoring', 'Checks'];

    for (const text of expectedMainTexts) {
      const textElement = this.page.locator('p', { hasText: text });
      await expect(textElement).toBeVisible();
    }
  }

  @stepPOM('Validates collapsable buttons functionality')
  async validatesCollapsableButtons() {
    const collapsableButtons = this.page.locator('[data-test="collapsable-button"]');
    const buttonsCount = await collapsableButtons.count();
    expect(buttonsCount).toBeGreaterThan(0);

    for (let i = 0; i < buttonsCount; i++) {
      const button = collapsableButtons.nth(i);
      await expect(button).toBeEnabled();
      await expect(button).toBeVisible();
      await button.click();
      const content = await button.textContent();
      expect(content).toBeDefined();
    }
  }
}
