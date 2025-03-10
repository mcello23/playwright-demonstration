import { expect, test } from '../utils/fixtures/e2e';

test.describe('Operations page validation @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.locator('[data-test="Operations"]').click();
  });

  test("Enters any operation and validates it's header elements @smoke", async ({ page }) => {
    await page.locator('[data-test^="operationDetail-"]').first().click();

    // Upper Header buttons
    const dataButon = page.getByRole('button', { name: 'Data' });
    await expect(dataButon).toBeEnabled();
    await expect(dataButon).toBeVisible();
    const securityButton = page.getByRole('button', { name: 'Security' });
    await expect(securityButton).toBeEnabled();
    await expect(securityButton).toBeVisible();
    const ocrButton = page.getByRole('button', { name: 'OCR' });
    await expect(ocrButton).toBeEnabled();
    await expect(ocrButton).toBeVisible();
    const timelineButton = page.getByRole('button', { name: 'Timeline' });
    await expect(timelineButton).toBeEnabled();
    await expect(timelineButton).toBeVisible();
    const advancedtrackingButton = page.getByRole('button', { name: 'Advanced tracking' });
    await expect(advancedtrackingButton).toBeEnabled();
    await expect(advancedtrackingButton).toBeVisible();

    // Upper Header statues
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

    const fullTextRegex = /^ID: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect(idTextContent?.trim()).toMatch(fullTextRegex);

    const currentStepLocator = page.locator('p.facephi-ui-label', {
      hasText: /Current Step:|Paso Actual:|Etapa Atual:/,
    });
    await expect(currentStepLocator).toBeVisible();

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
    const operationStatus = page.locator('p.facephi-ui-label', {
      hasText: /Started|Successful|Rejected/,
    });
    await expect(operationStatus).toBeVisible();
  });

  test('Enters a successful operation and validates all green/successful elements @smoke', async ({
    page,
  }) => {
    const resultsPage = page.locator('#tableBody');
    const successfullRow = resultsPage
      .locator('[data-test^="table-row-"]')
      .filter({
        hasText: /Successful|Exitoso|Conseguiu/,
      })
      .nth(1);

    const successOperation = successfullRow.locator('[data-test^="operationDetail-"]');
    await successOperation.click();
    await page.waitForRequest('**/operations/**');

    const successfullStepMessage = page.getByText('Successful step');
    await expect(successfullStepMessage).toBeVisible();

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
    const resultsPage = page.locator('#tableBody');
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
    await page.waitForRequest('**/operations/**');

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
});
