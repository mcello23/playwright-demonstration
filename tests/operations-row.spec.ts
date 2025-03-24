import { expect, test } from '../utils/controller/e2e';

test.describe('Operations page validation @regression', () => {
  test.beforeEach(async ({ operationPage }) => {
    await operationPage.goesToOperationsWait();
  });

  test('Sees all elements in Operations page @smoke', async ({ operationPage }) => {
    await operationPage.validateStaticElements();
    await operationPage.insertsRandomDate();
    await operationPage.insertsRandomNameOnInputSearch();
    await operationPage.selectsFilterButtonAndLabel();
    await operationPage.validatesDateOpIDTypesAndSteps();
  });

  test('Uses the calendar component with random dates, validating UI "X" and "Clear all" buttons and Rendering Server Components (RSC) responses', async ({
    operationPage,
    apiHelpers,
    calendarHelper,
  }) => {
    await calendarHelper.opensCalendar();
    await calendarHelper.goToPreviousMonth();
    await calendarHelper.selectRandomDateRange();

    apiHelpers.waitForMultipleRSCResponses(2);

    await operationPage.clicksOnXButtonToClearInput();

    await calendarHelper.opensCalendar();
    await calendarHelper.goToPreviousMonth();
    await calendarHelper.selectRandomDateRange();

    apiHelpers.waitForMultipleRSCResponses(2);

    await operationPage.clicksOnClearAllButtonToClearInput();
  });

  test('Validates there is a warning SVG element after a denied operation', async ({
    operationPage,
  }) => {
    await operationPage.findsRejectedOperation();
    await operationPage.findsErrorColorAndSVGWarning();
  });

  test('Sees the assets appear inside a listing', async ({ operationPage }) => {
    await operationPage.clicksOnFilesButton();
    await operationPage.validatesListingAndContent();
  });

  test('Opens the document modal and validates all buttons @smoke', async ({ page }) => {
    await test.step('Find an operation with status and click on Files button', async () => {
      const resultsPage = page.locator('#tableBody');

      const statusRow = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({
          hasText: /Successful|Exitosa|Conseguiu/,
        })
        .first();

      const filesButton = statusRow.getByRole('button', { name: /Files/ });
      await expect(filesButton).toBeVisible();
      await expect(filesButton).toBeEnabled();

      await filesButton.click();
    });

    await test.step('Select a document from files menu', async () => {
      const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
      await filesModal.click();
    });

    await test.step('Verify document modal appears with the image', async () => {
      await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
      const modalAssets = page.locator('[data-test="modal-assets"] img');
      await expect(modalAssets).toBeVisible();
    });

    await test.step('Validate all modal control buttons', async () => {
      const docBack = page
        .locator('div')
        .filter({ hasText: /^Document back$/ })
        .getByRole('button');
      await expect(docBack).toBeVisible();
      await expect(docBack).toBeEnabled();

      const minusZoom = page
        .locator('div')
        .filter({ hasText: /^100%$/ })
        .getByRole('button')
        .first();
      await expect(minusZoom).toBeVisible();
      await expect(minusZoom).toBeEnabled();

      const moreZoom = page
        .locator('div')
        .filter({ hasText: /^100%$/ })
        .getByRole('button')
        .nth(1);
      await expect(moreZoom).toBeVisible();
      await expect(moreZoom).toBeEnabled();

      const printBttn = page.locator('.facephi-ui-flex > div:nth-child(3) > button').first();
      await expect(printBttn).toBeVisible();
      await expect(printBttn).toBeEnabled();

      const downloadBttn = page.locator('div:nth-child(3) > button:nth-child(2)').first();
      await expect(downloadBttn).toBeVisible();
      await expect(downloadBttn).toBeEnabled();

      const backBttn = page
        .locator('.facephi-ui-modal__base > div > div:nth-child(3) > button')
        .first();
      await expect(backBttn).toBeVisible();
      await expect(backBttn).toBeDisabled();

      const fwdBttn = page.locator(
        '.facephi-ui-modal__base > div > div:nth-child(3) > button:nth-child(2)'
      );
      await expect(fwdBttn).toBeVisible();
      await expect(fwdBttn).toBeEnabled();
    });
  });

  test('Opens and closes the document modal', async ({ page }) => {
    await test.step('Find an operation with status and click on Files button', async () => {
      const resultsPage = page.locator('#tableBody');

      const statusRow = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({
          hasText: /Successful|Exitosa|Conseguiu/,
        })
        .first();

      await expect(statusRow).toBeVisible();

      const filesButton = statusRow.getByRole('button', { name: /Files/ });
      await expect(filesButton).toBeVisible();
      await expect(filesButton).toBeEnabled();

      await filesButton.click();
    });

    await test.step('Select a document from files menu', async () => {
      const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
      await filesModal.click();
    });

    await test.step('Verify document modal appears with the image', async () => {
      await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
      const modalAssets = page.locator('[data-test="modal-assets"] img');
      await expect(modalAssets).toBeVisible();
    });

    await test.step('Click on document back button', async () => {
      const docBack = page
        .locator('div')
        .filter({ hasText: /^Document back$/ })
        .getByRole('button');
      await docBack.click();
    });

    await test.step('Verify modal window is not visible', async () => {
      const modalWindow = page.locator('[data-test="modal-oberlay"]');
      await expect(modalWindow).not.toBeVisible();
    });
  });

  test('Validates the download functionality inside the modal', async ({ page }) => {
    await test.step('Find an operation with status and click on Files button', async () => {
      const resultsPage = page.locator('#tableBody');

      const statusRow = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({
          hasText: /Rejected|Rechazado|Rejeitado|Successful|Exitosa|Conseguiu/,
        })
        .first();

      await expect(statusRow).toBeVisible();

      const filesButton = statusRow.getByRole('button', { name: /Files/ });
      await expect(filesButton).toBeVisible();
      await expect(filesButton).toBeEnabled();

      await filesButton.click();
    });

    await test.step('Select a document from files menu', async () => {
      const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
      await filesModal.click();
    });

    await test.step('Verify document modal appears with the image', async () => {
      await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
      const modalAssets = page.locator('[data-test="modal-assets"] img');
      await expect(modalAssets).toBeVisible();
    });

    await test.step('Click on download button', async () => {
      const downloadPromise = page.waitForEvent('download');

      await page.locator('div:nth-child(3) > button:nth-child(2)').first().click();

      const download = await downloadPromise;

      const fileName = download.suggestedFilename();
      expect(fileName).toBeTruthy();

      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      expect('jpeg').toContain(fileExtension);
      console.log(`Downloaded file: ${fileName}`);

      const path = await download.path();
      expect(path).toBeTruthy();
    });
  });

  test('Validates the print functionality inside the modal', async ({ page }) => {
    let printPromise: Promise<void>;

    await test.step('Setup print function interception', async () => {
      printPromise = new Promise<void>((resolve) => {
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
    });

    await test.step('Find an operation with status and click on Files button', async () => {
      const resultsPage = page.locator('#tableBody');

      const statusRow = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({
          hasText: /Rejected|Rechazado|Rejeitado|Successful|Exitosa|Conseguiu/,
        })
        .first();

      await expect(statusRow).toBeVisible();

      const filesButton = statusRow.getByRole('button', { name: /Files/ });
      await expect(filesButton).toBeVisible();
      await expect(filesButton).toBeEnabled();

      await filesButton.click();
    });

    await test.step('Select a document from files menu', async () => {
      const filesModal = page.locator('button.facephi-ui-option-menu__item').nth(0);
      await filesModal.click();
    });

    await test.step('Verify document modal appears with the image', async () => {
      await expect(page.locator('[data-test="modal-assets"]')).toBeVisible();
      const modalAssets = page.locator('[data-test="modal-assets"] img');
      await expect(modalAssets).toBeVisible();
    });

    await test.step('Click on print button and validate', async () => {
      await page
        .locator('[data-test="modal-assets"] button:has(svg[viewBox="0 0 256 256"])')
        .nth(3)
        .click();
      await printPromise;
      console.log('Print function was successfully called');
    });
  });

  test("Validates that the column selector doesn't shows unselected toggles", async ({ page }) => {
    await test.step('Define available columns', async () => {
      const availableColumns = [
        'Start Date',
        'End Date',
        'User ID',
        'Type',
        'Steps',
        'Assets',
        'Status',
        'Actions',
      ];
      const numColumnsToToggle = Math.floor(Math.random() * availableColumns.length) + 1;

      // Select random columns to toggle
      const columnsToToggle = [];
      const availableIndices = [...Array(availableColumns.length).keys()];
      for (let i = 0; i < numColumnsToToggle; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
        columnsToToggle.push(availableColumns[selectedIndex]);
      }
    });

    await test.step('Click on column selector', async () => {
      await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
      const viewSelector = page.locator('[data-test="option-menu"]');
      await expect(viewSelector).toBeVisible();
    });

    await test.step('Toggle columns', async () => {
      const availableColumns = [
        'Start Date',
        'End Date',
        'User ID',
        'Type',
        'Steps',
        'Assets',
        'Status',
        'Actions',
      ];
      const numColumnsToToggle = Math.floor(Math.random() * availableColumns.length) + 1;

      // Select random columns to toggle
      const columnsToToggle = [];
      const availableIndices = [...Array(availableColumns.length).keys()];
      for (let i = 0; i < numColumnsToToggle; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
        columnsToToggle.push(availableColumns[selectedIndex]);
      }
      const viewSelector = page.locator('[data-test="option-menu"]');
      for (const columnLabel of columnsToToggle) {
        console.log(`Removing column: ${columnLabel}`);
        await viewSelector.getByLabel(columnLabel).click();
      }

      await page.mouse.click(0, 0);
    });

    await test.step('Verify columns are not visible', async () => {
      const availableColumns = [
        'Start Date',
        'End Date',
        'User ID',
        'Type',
        'Steps',
        'Assets',
        'Status',
        'Actions',
      ];
      const numColumnsToToggle = Math.floor(Math.random() * availableColumns.length) + 1;

      // Select random columns to toggle
      const columnsToToggle = [];
      const availableIndices = [...Array(availableColumns.length).keys()];
      for (let i = 0; i < numColumnsToToggle; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
        columnsToToggle.push(availableColumns[selectedIndex]);
      }
      for (const columnLabel of columnsToToggle) {
        const columnHeader = page.locator(`th:has-text("${columnLabel}")`);
        await expect(columnHeader).not.toBeVisible();
        console.log(`✅ Column "${columnLabel}" is not visilbe`);
      }
    });
  });
});
