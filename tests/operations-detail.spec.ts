import {
  clicksAnyOperation,
  clicksOperationRejected,
  clicksOperationSuccessful,
  expect,
  test,
} from '../utils/fixtures/e2e';

test.describe('Operations page validation @regression', async () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('[data-test="Operations"]').click();
  });

  test("Enters any operation and validates it's header elements @smoke", async ({ page }) => {
    await page.locator('[data-test^="operationDetail-"]').first().click();

    // Upper Header buttons
    const dataButton = page.getByRole('button', { name: 'Data' });
    await expect(dataButton).toBeEnabled();
    await expect(dataButton).toBeVisible();
    const securityButton = page.getByRole('button', { name: 'Security' });
    await expect(securityButton).toBeEnabled();
    await expect(securityButton).toBeVisible();
    const ocrButton = page.getByRole('button', { name: 'OCR' });
    await expect(ocrButton).toBeEnabled();
    await expect(ocrButton).toBeVisible();
    const timelineButton = page.getByRole('button', { name: 'Timeline' });
    await expect(timelineButton).toBeEnabled();
    await expect(timelineButton).toBeVisible();
    const advancedTrackingButton = page.getByRole('button', { name: 'Advanced tracking' });
    await expect(advancedTrackingButton).toBeEnabled();
    await expect(advancedTrackingButton).toBeVisible();

    // Upper Header status
    // Date format validation
    const dateLocator = page.locator('p.facephi-ui-label', { hasText: /Date:|Fecha:|Data:/ });
    await expect(dateLocator).toBeVisible();

    const dateElement = page
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
    const operationIdLocator = page.locator('p.facephi-ui-label', { hasText: 'ID:' });
    await expect(operationIdLocator).toBeVisible();

    const idTextContent = await operationIdLocator.textContent();
    expect(idTextContent).not.toBeNull();

    if (idTextContent) {
      const idRegex = /^ID:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
      const match = idTextContent.match(idRegex);
      expect(match).toBeDefined();
    }

    const endStepLocator = page
      .locator('p.facephi-ui-label', {
        hasText: /Start|Inicio|Começar|SelphID|Selphi|Finish|Fin|Fim/,
      })
      .nth(0);
    await expect(endStepLocator).toBeVisible();

    const operationName = page
      .locator('p.facephi-ui-label', {
        hasText: /Onboarding|Authentication|Autenticación|Autenticação/,
      })
      .nth(0);
    await expect(operationName).toBeVisible();

    // TODO: add other locales
    const operationStatus = page
      .locator('div')
      .filter({ hasText: /^Successful|Started|Rejected$/ })
      .nth(0);
    await expect(operationStatus).toBeVisible();
  });

  test('Enters a successful operation and validates all green/successful elements @smoke', async ({
    page,
  }) => {
    await clicksOperationSuccessful(page);

    const successfulStepMessage = page.getByText('Successful step');
    await expect(successfulStepMessage).toBeVisible();

    const successIcon = page
      .locator('div.facephi-ui-icon-wrapper[style*="--colors-success400"]')
      .nth(0);
    await expect(successIcon).toBeVisible();

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

  test('Enters a rejected operation and validates all red/unsuccessful elements @smoke', async ({
    page,
  }) => {
    await clicksOperationRejected(page);

    const errorDiv = page.locator('div.facephi-ui-flex[style*="--colors-error500"]');
    await expect(errorDiv).toBeVisible();
    expect(errorDiv).toBeTruthy();

    const errorMessage = page.locator('div', { hasText: /^Failed step/ }).nth(0);
    await expect(errorMessage).toBeVisible();

    const errorIcon = page
      .locator('div.facephi-ui-icon-wrapper[style*="--colors-error400"]')
      .nth(0);
    await expect(errorIcon).toBeVisible();
  });

  test('Validates that the requirements details of a successful operation are seen in UI', async ({
    page,
  }) => {
    await clicksOperationSuccessful(page);

    const sessionPassedMessage = page.getByText(/This session has passed the following tests:/);
    await expect(sessionPassedMessage).toBeVisible();

    const selfieImage = page.getByRole('figure').filter({ hasText: 'Selfie' }).getByRole('img');
    await expect(selfieImage).toBeVisible();

    const selfieDocumentContainer = page
      .locator('figure', { hasText: 'Document image' })
      .getByRole('img');
    await expect(selfieDocumentContainer).toBeVisible();

    const firstText = page.getByText('The person in the document and selfie match');
    await expect(firstText).toBeVisible();

    const belowText = page.getByText('Passive liveness');
    await expect(belowText).toBeVisible();

    const nationalityText = page.getByText('Nationality and geolocation match');
    await expect(nationalityText).toBeVisible();

    const scoreText = page.getByText(/Score:\s*\d+\.\d+%/);
    await expect(scoreText).toBeVisible();

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

  test('Valida textos OCR', async ({ page }) => {
    await clicksAnyOperation(page);
    await page.getByRole('button', { name: 'OCR' }).click();

    const expectedMainTexts = ['Front side', 'Back side', 'Scoring', 'Checks'];

    for (const text of expectedMainTexts) {
      const textElement = page.locator('p', { hasText: text });
      await expect(textElement).toBeVisible();
    }
    await page.locator('[data-test="collapsable-button"]').first().click();

    const expandedElements = page.locator(
      'div.facephi-ui-card-collapsable__collapsable-wrapper.facephi-ui-card-collapsable__collapsable-wrapper--isOpen_true'
    );

    await expect(expandedElements.first()).toBeVisible();

    const frontSide = expandedElements.locator('ul.facephi-ui-flex');
    await expect(frontSide).toHaveCount(8);
  });
});
