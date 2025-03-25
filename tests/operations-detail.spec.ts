import { expect, test } from '../utils/controller/e2e';

test.describe('Operations page validation @regression', async () => {
  test.beforeEach(async ({ operationPage }) => {
    await operationPage.goesToOperations();
  });

  test("Enters any operation and validates it's header elements @smoke", async ({
    operationDetailPage,
  }) => {
    await operationDetailPage.entersOperationDetail_Any();
    await operationDetailPage.validatesAllHeaderElements();
  });

  test('Enters a successful operation and validates all green/successful elements @smoke', async ({
    page,
    operationPage,
  }) => {
    await operationPage.clicksOperationSuccessful();

    await test.step('Validate successful status messages and icons', async () => {
      const successfulStepMessage = page.getByText('Successful step');
      await expect(successfulStepMessage).toBeVisible();

      const successIcon = page
        .locator('div.facephi-ui-icon-wrapper[style*="--colors-success400"]')
        .nth(0);
      await expect(successIcon).toBeVisible();
    });

    await test.step('Validate timeline header and items', async () => {
      const timelineHeader = page.locator('div.facephi-ui-card__header', { hasText: 'Timeline' });
      await expect(timelineHeader).toBeVisible();

      const expectedTimelineItems = ['Document', 'Face', 'Security Checks', 'Finish'];

      for (const item of expectedTimelineItems) {
        const timelineItem = page
          .locator('div', {
            hasText: new RegExp(`^${item}$`),
          })
          .first();

        await expect(timelineItem).toBeVisible();
        console.log(`✅ "${item}" is visible in Timeline`);
      }
    });
  });

  test('Enters a rejected operation and validates all red/unsuccessful elements @smoke', async ({
    page,
    operationPage,
  }) => {
    await test.step('Navigate to rejected operation details', async () => {
      await operationPage.clicksOperationRejected();
    });

    await test.step('Validate error styling and messages', async () => {
      const errorDiv = page.locator('div.facephi-ui-flex[style*="--colors-error500"]');
      await expect(errorDiv).toBeVisible();

      const errorMessage = page.locator('div', { hasText: /^Failed step/ }).first();
      await expect(errorMessage).toBeVisible();

      const errorContainer = page.locator('div:has-text("Failed step")').first();
      const errorIcon = errorContainer
        .locator('div[class*="icon-wrapper"], div[class*="IconWrapper"]')
        .first();
      await expect(errorIcon).toBeVisible();
    });
  });

  test('Validates that the requirements details of a successful operation are seen in UI', async ({
    page,
    operationPage,
  }) => {
    await test.step('Navigate to successful operation details', async () => {
      await operationPage.clicksOperationSuccessful();
    });

    await test.step('Validate session status message', async () => {
      const sessionPassedMessage = page.getByText(/This session has passed the following tests:/);
      await expect(sessionPassedMessage).toBeVisible();
    });

    await test.step('Validate selfie and document images', async () => {
      const selfieImage = page.getByRole('figure').filter({ hasText: 'Selfie' }).getByRole('img');
      await expect(selfieImage).toBeVisible();

      const selfieDocumentContainer = page
        .locator('figure', { hasText: 'Document image' })
        .getByRole('img');
      await expect(selfieDocumentContainer).toBeVisible();
    });

    await test.step('Validate verification text elements', async () => {
      const firstText = page.getByText('The person in the document and selfie match');
      await expect(firstText).toBeVisible();

      const belowText = page.getByText('Passive liveness');
      await expect(belowText).toBeVisible();

      const nationalityText = page.getByText('Nationality and geolocation match');
      await expect(nationalityText).toBeVisible();

      const scoreText = page.getByText(/Score:\s*\d+\.\d+%/);
      await expect(scoreText).toBeVisible();
    });

    await test.step('Validate ID verification section', async () => {
      const idVerificationSection = page.getByText('ID Verification').first();
      await expect(idVerificationSection).toBeVisible();

      const idImages = page
        .locator('img')
        .filter({
          has: page.getByText('ID Verification'),
        })
        .or(page.locator('div:near(:text("ID Verification")) img'));

      const count = await idImages.count();
      expect(count).toBeGreaterThanOrEqual(2);
      expect(count).toBeLessThanOrEqual(4);
    });

    await test.step('Validate collapsable elements functionality', async () => {
      await page.locator('[data-test="collapsable-button"]').first().click();
      const collapsable = page.locator('button.facephi-ui-option-menu__item');
      const countCollapsable = await collapsable.count();
      expect(countCollapsable).toBeGreaterThanOrEqual(1);
      expect(countCollapsable).toBeLessThanOrEqual(6);

      await page.locator('[data-test="collapsable-button"]').last().click();
      const collapsableSelphi = page.getByRole('listitem').filter({ hasText: 'Selfie' });
      expect(collapsableSelphi).toBeVisible();
      expect(collapsableSelphi).toBeEnabled();
    });
  });

  test('Validates OCR section inside a operation', async ({ page, operationPage }) => {
    await test.step('Navigate to any operation and clicks on OCR tab', async () => {
      await operationPage.clicksOperationSuccessful();
      await page.getByRole('button', { name: 'OCR' }).click();
    });

    await test.step('Validate main section headings', async () => {
      const expectedMainTexts = ['Document front', 'Document back', 'Scoring', 'Checks'];

      for (const text of expectedMainTexts) {
        const textElement = page.locator('p', { hasText: text });
        await expect(textElement).toBeVisible();
      }
    });

    await test.step('Validate collapsable buttons functionality', async () => {
      const buttons = page.locator('[data-test="collapsable-button"]');
      const buttonsNum = await buttons.count();
      expect(buttonsNum).toBe(1); // Remove

      for (let i = 0; i < buttonsNum; i++) {
        const button = buttons.nth(i);
        await expect(button).toBeEnabled();
        await expect(button).toBeVisible();
        await button.click();
        const content = await button.textContent();
        expect(content).toBeDefined();
      }
    });
  });
});
//TODO: improve more tests with recent changes
