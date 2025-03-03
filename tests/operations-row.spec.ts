import { faker } from '@faker-js/faker';
import { expect, getFormattedDateRange, test, verifyDateRangeInput } from '../utils/fixtures/e2e.ts';

test.describe('Operations page validation @regression', () => {
  test.beforeEach(async ({ page }) => {
    const operationsButton = page.locator('[data-test="Operations"]');
    await expect(operationsButton).toBeVisible();
    await expect(operationsButton).toBeEnabled();
    await operationsButton.click();
  });
  
  test('I want to see all elements in Operations page @smoke', async ({ page }) => {
    // Static elements
    await expect(page.locator('[data-test="filter-by-date"]')).toBeVisible();
    await expect(page.locator('[data-test="filter-by-date"]')).toBeEnabled();
    await expect(page.locator('[data-test="filter-by-name"]')).toBeVisible();
    await expect(page.locator('[data-test="filter-by-name"]')).toBeEnabled();
    await expect(page.locator('[data-test="filter-button"]')).toBeVisible();
    await expect(page.locator('[data-test="filter-button"]')).toBeEnabled();
    
    const formattedDate = getFormattedDateRange();
  
    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDate);
    await filterByDateLocator.press('Enter');
    await filterByDateLocator.focus();
    await verifyDateRangeInput(filterByDateLocator, formattedDate);

    // Test Search input
    await expect(page.locator('[data-test="filter-by-name"]')).toBeEnabled();
    const randomName = faker.person.firstName();
    await page.locator('[data-test="filter-by-name"]').fill(randomName);
    await expect(page.locator('[data-test="clear-all"]')).toBeVisible();
    await page.locator('[data-test="clear-all"]').click();
    await expect(page.locator('[data-test="filter-by-name"]')).not.toHaveValue(randomName);

    // Test Filter button
    await page.locator('[data-test="filter-button"]').click();
    await page.getByLabel('Onboarding').click();
    await expect(page.locator('[data-test="chip-ONBOARDING"]')).toBeVisible();

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
    await expect(steps).toBeVisible();
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

  test('I want to see that assets appear inside the listing', async ({ page }) => {
    const filesButton = page.getByRole('button', { name: /Files \(\d+\)/ }).first();
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    
    // Clicar no botão
    await filesButton.click();
  
    const filesModal = page.locator('[data-test="option-menu"]');
    await expect(filesModal).toBeVisible();
    await expect(filesModal).toBeEnabled();
    
    // Contar os itens no menu de opções
    const optionItems = filesModal.locator('button.facephi-ui-option-menu__item');
    const count = await optionItems.count();
    
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(6);
    
    console.log(`Found ${count} option menu items`);
  });

  test('I want to open a modal and validate all buttons @smoke', async ({ page }) => {
    const resultsPage = page.locator('#tableBody');
    
    const statusRow = resultsPage.locator('[data-test^="table-row-"]').filter({ 
      hasText: /Rejected|Rechazado|Rejeitado|Successful|Exitosa|Conseguiu/
    }).first();
    
    const filesButton = statusRow.getByRole('button', { name: /Files/ });
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    
    await filesButton.click();
  
    const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
    await filesModal.click();
  
    await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
    const modalAssets = page.locator('[data-test="modal-assets"] img');
    await expect(modalAssets).toBeVisible();

    const docBack = page.locator('div').filter({ hasText: /^Document back$/ }).getByRole('button');
    await expect(docBack).toBeVisible();
    await expect(docBack).toBeEnabled();

    const minusZoom = page.locator('div').filter({ hasText: /^100%$/ }).getByRole('button').first();
    await expect(minusZoom).toBeVisible();
    await expect(minusZoom).toBeEnabled();

    const moreZoom = page.locator('div').filter({ hasText: /^100%$/ }).getByRole('button').nth(1);
    await expect(moreZoom).toBeVisible();
    await expect(moreZoom).toBeDisabled();

    const printBttn = page.locator('div:nth-child(3) > button').first();
    await expect(printBttn).toBeVisible();
    await expect(printBttn).toBeEnabled();

    const downloadBttn = page.locator('div:nth-child(3) > button:nth-child(2)').first();
    await expect(downloadBttn).toBeVisible();
    await expect(downloadBttn).toBeEnabled();

    const backBttn = page.locator('.facephi-ui-modal__base > div > div:nth-child(3) > button').first();
    await expect(backBttn).toBeVisible();
    await expect(backBttn).toBeDisabled();

    const fwdBttn = page.locator('.facephi-ui-modal__base > div > div:nth-child(3) > button:nth-child(2)');
    await expect(fwdBttn).toBeVisible();
    await expect(fwdBttn).toBeEnabled();
  });

  test('I want to open and close the modal', async ({ page }) => {
    const resultsPage = page.locator('#tableBody');
    
    const statusRow = resultsPage.locator('[data-test^="table-row-"]').filter({ 
      hasText: /Rejected|Rechazado|Rejeitado|Successful|Exitosa|Conseguiu/
    }).first();
    
    await expect(statusRow).toBeVisible();
    
    const filesButton = statusRow.getByRole('button', { name: /Files/ });
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    
    await filesButton.click();
  
    const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
    await filesModal.click();
  
    await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
    const modalAssets = page.locator('[data-test="modal-assets"] img');
    await expect(modalAssets).toBeVisible();

    const docBack = page.locator('div').filter({ hasText: /^Document back$/ }).getByRole('button');
    await docBack.click();

    const modalWindow = page.locator('[data-test="modal-oberlay"]');
    await expect(modalWindow).not.toBeVisible();
  });

  test('I want to validate the asset download functionality inside the modal', async ({ page }) => {
    const resultsPage = page.locator('#tableBody');
    
    const statusRow = resultsPage.locator('[data-test^="table-row-"]').filter({ 
      hasText: /Rejected|Rechazado|Rejeitado|Successful|Exitosa|Conseguiu/
    }).first();
    
    await expect(statusRow).toBeVisible();
    
    const filesButton = statusRow.getByRole('button', { name: /Files/ });
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    
    await filesButton.click();
  
    const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
    await filesModal.click();
  
    await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
    const modalAssets = page.locator('[data-test="modal-assets"] img');
    await expect(modalAssets).toBeVisible();
  
    const downloadPromise = page.waitForEvent('download');

    await page.locator('div:nth-child(3) > button:nth-child(2)').first().click();
    
    const download = await downloadPromise;
    
    const fileName = download.suggestedFilename();
    expect(fileName).toBeTruthy();
    
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    expect('jpeg').toContain(fileExtension);
    
    const path = await download.path();
    expect(path).toBeTruthy();
  });
  
  test('I want to validate the print functionality inside the modal', async ({ page }) => {
    const printPromise = new Promise<void>((resolve) => {
      page.exposeFunction('notifyPrintCalled', () => {
        resolve();
      });
    });
    
    await page.addInitScript(() => {
      const originalPrint = window.print;
      window.print = () => {
        // Call original function
        // And prevents opening the real print windows by commenting:
        // originalPrint.call(window);

        // @ts-ignore
        window.notifyPrintCalled();
      };
    });
  
    const resultsPage = page.locator('#tableBody');
    
    const statusRow = resultsPage.locator('[data-test^="table-row-"]').filter({ 
      hasText: /Rejected|Rechazado|Rejeitado|Successful|Exitosa|Conseguiu/
    }).first();
    
    await expect(statusRow).toBeVisible();
    
    const filesButton = statusRow.getByRole('button', { name: /Files/ });
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    
    await filesButton.click();
  
    const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
    await filesModal.click();
  
    await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
    const modalAssets = page.locator('[data-test="modal-assets"] img');
    await expect(modalAssets).toBeVisible();
  
    await Promise.all([
      printPromise,
      page.locator('div:nth-child(3) > button').first().click()
    ]);

    console.log('Print function was successfully called');
  });
});