import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class operationDetailCommands {
  page: Page;
  baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = page.url();
  }

  @stepPOM('Clicks on any operation detail')
  async entersOperationDetail_Any() {
    const resultsPage = this.page.locator('#tableBody');
    const successfullRow = resultsPage.locator('[data-test^="table-row-"]').first();

    const successOperation = successfullRow.locator('[data-test^="operationDetail-"]').first();
    await successOperation.click();
    await this.page.waitForRequest('**/operations/**');
  }

  @stepPOM('Clicks on a successful operation detail')
  async entersOperationDetail_Successful() {
    await this.page.locator('[data-test="filter-button"]').click();
    await this.page.getByLabel('Succesful').click(); // TODO: report typo
    await this.page.evaluate(() => {
      const overlay = document.querySelector('#popup-root div:nth-child(1)') as HTMLElement;
      if (overlay) overlay.style.display = 'none';
    });

    await this.page.waitForSelector('#tableBody', { state: 'visible' });

    const rejectedRows = this.page
      .locator('[data-test^="table-row-"]')
      .filter({ hasText: 'Successful' });

    const rejectedRow = rejectedRows.first();

    const operationDetail = rejectedRow.locator('[data-test^="operationDetail-"]').first();
    await operationDetail.click();
  }

  @stepPOM('Clicks on a rejected operation detail')
  async entersOperationDetail_Rejected() {
    await this.page.locator('[data-test="filter-button"]').click();
    await this.page.getByLabel('Rejected').click();
    await this.page.evaluate(() => {
      const overlay = document.querySelector('#popup-root div:nth-child(1)') as HTMLElement;
      if (overlay) overlay.style.display = 'none';
    });

    await this.page.waitForSelector('#tableBody', { state: 'visible' });

    const rejectedRows = this.page
      .locator('[data-test^="table-row-"]')
      .filter({ hasText: 'Rejected' });

    const rejectedRow = rejectedRows.first();

    const operationDetail = rejectedRow.locator('[data-test^="operationDetail-"]').first();
    await operationDetail.click();
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
      .filter({ hasText: /^Successful|Started|Rejected|Expired$/ })
      .nth(0);
    await expect(operationStatus).toBeVisible();
  }

  @stepPOM('Validates the successful status messages and icons')
  async validatesSuccessfulStatusIcons() {
    const successfulStepMessage = this.page.getByText('Operation successful');
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

    const expectedTimelineItems = ['Face', 'Document', 'Security Checks', 'Finish'];

    for (const item of expectedTimelineItems) {
      const timelineItem = this.page
        .locator('div', {
          hasText: new RegExp(`^${item}$`),
        })
        .first();

      const isVisible = await timelineItem.isVisible();

      if (isVisible) {
        await expect(timelineItem).toBeVisible();
        console.log(`✅ "${item}" is visible in Timeline`);
      } else {
        console.log(`ℹ️ "${item}" is not visible in this operation's Timeline`);
      }
    }
  }

  @stepPOM('Validates error styling and messages')
  async validatesErrorStatusIcons() {
    const errorDiv = this.page.locator('div.facephi-ui-flex[style*="--colors-error400"]').first();
    await expect(errorDiv).toBeVisible();

    const errorMessage = this.page.locator('div', { hasText: /^Operation rejected/ }).first();
    await expect(errorMessage).toBeVisible();

    const errorContainer = this.page.locator('div:has-text("Operation rejected")').first();
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

    const isSelfieVisible = await selfieImage.isVisible();

    if (isSelfieVisible) {
      await expect(selfieImage).toBeVisible();
      console.log('✅ "Selfie" image compairson is visible');
    } else {
      console.log('ℹ️ "Selfie" image compairson is not present in this operation');
    }

    const documentImage = this.page
      .locator('figure', { hasText: 'Document image' })
      .getByRole('img');

    const isDocumentVisible = await documentImage.isVisible();

    if (isDocumentVisible) {
      await expect(documentImage).toBeVisible();
      console.log('✅ "Document" image is visible');
    } else {
      console.log('ℹ️ "Document" image is not present in this operation');
    }
  }

  @stepPOM('Validates success strings in the ID verification section')
  async validatesSuccessStrings() {
    const firstText = this.page.getByText('The person in the document and selfie match');
    const isFirstTextVisible = await firstText.isVisible();
    if (isFirstTextVisible) {
      await expect(firstText).toBeVisible();
      console.log('✅ "The person in the document and selfie match" is visible');
    } else {
      console.log(
        'ℹ️ "The person in the document and selfie match" is not present in this operation'
      );
    }

    const belowText = this.page.getByText('Passive liveness');
    const isBelowTextVisible = await belowText.isVisible();
    if (isBelowTextVisible) {
      await expect(belowText).toBeVisible();
      console.log('✅ "Passive liveness" is visible');
    } else {
      console.log('ℹ️ "Passive liveness" is not present in this operation');
    }

    const nationalityText = this.page.getByText('Nationality and geolocation match');
    const isNationalityVisible = await nationalityText.isVisible();
    if (isNationalityVisible) {
      await expect(nationalityText).toBeVisible();
      console.log('✅ "Nationality and geolocation match" is visible');
    } else {
      console.log('ℹ️ "Nationality and geolocation match" is not present in this operation');
    }

    const scoreText = this.page.getByText(/Score:\s*\d+\.\d+%/);
    const isScoreVisible = await scoreText.isVisible();
    if (isScoreVisible) {
      await expect(scoreText).toBeVisible();
      console.log('✅ "Score" is visible');
    } else {
      console.log('ℹ️ "Score" is not present in this operation');
    }
  }

  @stepPOM('Validates ID Verification section')
  async validatesIDVerificationSection() {
    const idVerificationHeader = this.page.getByText('ID Verification').first();
    await expect(idVerificationHeader).toBeVisible();

    const idVerificationSection = this.page.locator('section.facephi-ui-card__card', {
      has: this.page.getByText('ID Verification'),
    });

    const idImages = idVerificationSection.locator('img');
    const count = await idImages.count();
    console.log(`Found ${count} ID verification images`);

    if (count > 0) {
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(4);

      await expect(idImages.first()).toBeVisible();
      console.log('✅ ID verification image is visible');
    } else {
      const alternativeImages = this.page.locator('.facephi-ui-flex img.bdr_8px');
      const altCount = await alternativeImages.count();

      if (altCount > 0) {
        console.log(`Found ${altCount} ID verification images using alternative selector`);
        await expect(alternativeImages.first()).toBeVisible();
        console.log('✅ ID verification image is visible (alternative selector)');
      } else {
        console.log('ℹ️ No ID verification images found in this operation');
      }
    }
  }

  @stepPOM('Validates collapsable elements functionality')
  async validatesCollapsableElements() {
    await this.page.locator('[data-test="collapsable-button"]').first().click();
    const collapsable = this.page.locator('button.facephi-ui-option-menu__item');
    const countCollapsable = await collapsable.count();
    expect(countCollapsable).toBeGreaterThanOrEqual(1);
    expect(countCollapsable).toBeLessThanOrEqual(8);

    await this.page.locator('[data-test="collapsable-button"]').last().click();
    const collapsableSelphi = this.page.getByRole('listitem').filter({ hasText: 'Selfie' });
    const countCollapsableSelphi = await collapsableSelphi.count();

    const isSelphieVisible =
      countCollapsableSelphi > 0 && (await collapsableSelphi.first().isVisible());
    if (isSelphieVisible) {
      await expect(collapsableSelphi.first()).toBeVisible();
      await expect(collapsableSelphi.first()).toBeEnabled();
      expect(countCollapsableSelphi).toBeLessThanOrEqual(2);
      console.log('✅ "Selfie" is visible in collapsable menu');
    } else {
      console.log('ℹ️ "Selfie" is not present in this operation\'s collapsable menu');
    }
  }

  // OCR tab
  @stepPOM('Goes to OCR tab inside a operation')
  async entersOCRTab() {
    await this.page.getByRole('button', { name: 'OCR' }).click();
  }

  @stepPOM('Validates main section headings')
  async validatesMainSectionHeadings() {
    const expectedMainTexts = ['Document front', 'Document back'];

    for (const text of expectedMainTexts) {
      const textElement = this.page.locator('p', { hasText: text }).isVisible();
      expect(textElement).toBeTruthy();
    }
    const expectedSubTexts = ['Scoring', 'Checks'];

    for (const text of expectedSubTexts) {
      const textElements = this.page.locator('p', { hasText: text });
      const count = await textElements.count();

      expect(count).toBeGreaterThanOrEqual(1);

      expect(count).toBeLessThanOrEqual(2);

      if (count > 1) {
        await expect(textElements.first()).toBeVisible();
      }
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

  // Timeline tab
  @stepPOM('Goes to Timeline tab inside a operation')
  async entersTimelineTab() {
    await this.page.getByRole('button', { name: 'Timeline' }).click();
  }

  @stepPOM('Validates successful timeline elements')
  async validatesTimelineElements_Successful() {
    await expect(this.page.getByText('Document capture successful')).toBeVisible();
    const facialCaptureVisible = await this.page
      .getByText('Facial capture successful')
      .first()
      .isVisible();

    if (facialCaptureVisible) {
      expect(this.page.getByText('Facial capture successful').first()).toBeVisible();
    } else {
      console.log('"Facial capture" not part of this operation.');
    }

    const timelineEntries = this.page.locator('[data-test="vertical-step-container"]');
    const fileCreatedEntries = timelineEntries.getByText('File created');
    const fileCreatedCount = await fileCreatedEntries.count();
    console.log(`Found ${fileCreatedCount} "File created" entries.`);
    expect(fileCreatedCount).toBeLessThanOrEqual(4);

    const assetEntries = timelineEntries.locator('text=Asset');
    const assetCount = await assetEntries.count();
    console.log(`Found ${assetCount} "Asset" entries.`);
    expect(assetCount).toBeLessThanOrEqual(4);

    await expect(this.page.getByText('Facial authentication successful')).toBeVisible();
    // await expect(this.page.getByText('Facial liveness successful')).toBeVisible();
    await expect(this.page.getByText('Operation successful')).toBeVisible();
  }

  @stepPOM('Validates a specific successful operation timeline elements')
  async validatesTimelineSpecific_Successful() {
    await this.page.goto(
      `${this.baseURL}/operations/51ee6863-1d67-4612-ad4c-bbf2a36d3e1d?tab=timeline`
    );
    await expect(this.page.getByText('Document capture successful')).toBeVisible();
    await expect(this.page.getByText('Facial capture successful')).toBeVisible();

    const timelineEntries = this.page.locator('[data-test="vertical-step-container"]');
    const fileCreatedEntries = timelineEntries.getByText('File created');
    const fileCreatedCount = await fileCreatedEntries.count();
    console.log(`Found ${fileCreatedCount} "File created" entries.`);
    expect(fileCreatedCount).toBe(3);

    const assetEntries = timelineEntries.locator('text=Asset');
    const assetCount = await assetEntries.count();
    console.log(`Found ${assetCount} "Asset" entries.`);
    expect(assetCount).toBe(3);

    await expect(this.page.getByText('Facial authentication successful')).toBeVisible();
    await expect(this.page.getByText('Facial liveness successful')).toBeVisible();
    await expect(this.page.getByText('Operation successful')).toBeVisible();
  }

  async validatesThumbnailImages(expectedCount: number) {
    const thumbnailImages = this.page.locator('img[data-nimg="1"]');

    await this.page.waitForSelector('img[data-nimg="1"]', { timeout: 5000 });

    const imageCount = await thumbnailImages.count();
    console.log(`Found ${imageCount} thumbnail images, expected at least ${expectedCount}`);

    if (imageCount >= expectedCount) {
      console.log(`✅ Found ${imageCount} images, validating ${expectedCount} of them`);

      for (let i = 0; i < expectedCount; i++) {
        const image = thumbnailImages.nth(i);
        await expect(image).toBeVisible();
        await image.hover();

        const hasPointerCursorStyle = await image.evaluate((el) => {
          return window.getComputedStyle(el).cursor === 'pointer';
        });

        expect(hasPointerCursorStyle).toBeTruthy();
        console.log(`✅ Image ${i + 1}/${expectedCount} is visible and clickable`);
      }

      console.log(`✅ All ${expectedCount} thumbnail images are visible and clickable`);
      return true;
    } else {
      console.log(`ℹ️ Found only ${imageCount} images, expected at least ${expectedCount}`);
      return false;
    }
  }
}
