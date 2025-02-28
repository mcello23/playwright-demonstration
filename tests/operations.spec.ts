import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

test.describe('Operations page validation @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="Operations"]').click();
  });
  test('I want to see all elements in Operations page @smoke', async ({ page }) => {
    // Static elements
    page.locator('[data-test="filter-by-date"]').isEnabled();
    page.locator('[data-test="filter-by-date"]').isVisible();
    page.locator('[data-test="filter-by-name"]').isEnabled();
    page.locator('[data-test="filter-by-name"]').isVisible();
    page.locator('[data-test="filter-button"]').isEnabled();
    page.locator('[data-test="filter-button"]').isVisible();

    // Test Filter date
    const daysInPast = 30;
    const daysInFuture = 30;
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - daysInPast));
    const endDate = new Date(today.setDate(today.getDate() + daysInFuture));

    const formattedDateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDateRange);
    await filterByDateLocator.focus();
    await expect(filterByDateLocator).toHaveValue(formattedDateRange);

    // Test Search input
    page.locator('[data-test="filter-by-name"]').isEnabled();
    const randomName = faker.person.firstName();
    page.locator('[data-test="filter-by-name"]').fill(randomName);
    await page.locator('[data-test="clear-all"]').isVisible();
    await page.locator('[data-test="clear-all"]').click();
    expect(page.locator('[data-test="filter-by-name"]')).not.toHaveValue(randomName);

    // Test Filter button
    page.locator('[data-test="filter-button"]').click();
    page.getByLabel('Onboarding').click();
    page.locator('[data-test="chip-ONBOARDING"]').isVisible();

    // Date and time format
    const dateRegex = /^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    await expect(page.getByText(dateRegex).nth(0)).toBeVisible();
    // Operation ID format
    const operationIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    await expect(page.getByText(operationIdRegex).nth(0)).toBeVisible();
    // Type format
    const typeOnboarding = page.locator('[data-test="table-row-0"]').getByText('Onboarding');
    await expect(typeOnboarding).toBeVisible();
    // Onboarding steps format
    const steps = page.locator('[data-test="table-row-0"]').getByRole('cell').filter({ hasText: /^$/ }).first();
    expect(steps).toBeVisible();
  });
  test('I want to enter an operation and validate it\'s header elements @smoke', async ({ page }) => {
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

    const dateElement = page.locator('p.facephi-ui-label', {
      hasText: /\d{2}\/\d{2}\/\d{2}/
    }).first();
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

    const currentStepLocator = page.locator('p.facephi-ui-label', { hasText: /Current Step:|Paso Actual:|Etapa Atual:/ });
    await expect(currentStepLocator).toBeVisible();

    const endStepLocator = page.locator('p.facephi-ui-label', { hasText: /Start|Inicio|Começar|SelphID|Selphi|Finish|Fin|Fim/ }).nth(0);
    await expect(endStepLocator).toBeVisible();

    const operationName = page.locator('p.facephi-ui-label', { hasText: /Onboarding|Authentication|Autenticación|Autenticação/ }).nth(0);
    await expect(operationName).toBeVisible();

    // TODO: add other locales / fix eng translation 
    const operationStatus = page.locator('p.facephi-ui-label', { hasText: /Started|Successful|Rejected/ });
    await expect(operationStatus).toBeVisible();
  });
  test('I want to validate that a denied operation has a warning', async ({ page }) => {
    const resultsPage = page.locator('#tableBody');
    
    const rejectedRow = resultsPage.locator('[data-test^="table-row-"]').filter({ 
      hasText: /Rejected|Rechazado|Rejeitado/
    }).first();
    
    await expect(rejectedRow).toBeVisible();
    
    const errorStatusElement = rejectedRow.locator('span.facephi-ui-status[style*="--colors-error400"]');
    await expect(errorStatusElement).toBeVisible();
    
    const rejectedOperationElement = rejectedRow.locator('[data-test^="operationDetail-"]').nth(1);

    await expect(rejectedOperationElement).toHaveAttribute('href', expect.stringContaining('?tab=timeline'));
  
    await rejectedOperationElement.focus();
    await expect(rejectedOperationElement).toBeEnabled();
  });

  test.skip('I want to enter a rejected operation and validate all items @smoke', async ({ page }) => {
    await page.locator('[data-test="operationDetail-4dbcf3da-676e-4962-b1d9-8b3f36039cd3"]').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });
});