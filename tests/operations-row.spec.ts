import { faker } from '@faker-js/faker';
import {
  CalendarHelper,
  expect,
  getFormattedDateRange,
  test,
  verifyDateRangeInput,
  waitForMultipleRSCResponses,
} from '../utils/fixtures/e2e';

test.describe('Operations page validation @regression', () => {
  test.beforeEach(async ({ page }) => {
    const operationsButton = page.locator('[data-test="Operations"]');
    await expect(operationsButton).toBeVisible();
    await operationsButton.click();
    await page.locator('[data-test="header"]').getByText('Operations').focus();
  });

  test('Sees all elements in Operations page @smoke', async ({ page }) => {
    await test.step('Validate static elements visibility and interactivity', async () => {
      // Static elements
      await expect(page.locator('[data-test="filter-by-date"]')).toBeVisible();
      await expect(page.locator('[data-test="filter-by-date"]')).toBeEnabled();
      await expect(page.locator('[data-test="filter-by-search"]')).toBeVisible();
      await expect(page.locator('[data-test="filter-by-search"]')).toBeEnabled();
      await expect(page.locator('[data-test="filter-button"]')).toBeVisible();
      await expect(page.locator('[data-test="filter-button"]')).toBeEnabled();
    });

    await test.step('Test date filter functionality', async () => {
      const formattedDate = getFormattedDateRange();

      const filterByDateLocator = page.locator('[data-test="filter-by-date"]');
      await filterByDateLocator.click();
      await filterByDateLocator.fill(formattedDate);
      await filterByDateLocator.press('Enter');
      await filterByDateLocator.focus();
      await verifyDateRangeInput(filterByDateLocator, formattedDate);
    });

    await test.step('Test search input and clear functionality', async () => {
      const randomName = faker.person.firstName();
      await page.locator('[data-test="filter-by-search"]').fill(randomName);
      await expect(page.locator('[data-test="clear-all"]')).toBeVisible();
      await page.locator('[data-test="clear-all"]').click();
      await expect(page.locator('[data-test="filter-by-search"]')).not.toHaveValue(randomName);
    });

    await test.step('Test filter button functionality', async () => {
      await page.locator('[data-test="filter-button"]').click();
      await page.getByLabel('Onboarding').click();
      const buttonChecked = page.locator('[data-test="filter-option-ONBOARDING"] label').first();
      await expect(buttonChecked).toHaveAttribute('aria-checked', 'true');
      await page.mouse.click(10, 10);
    });

    await test.step('Validate date/time format and operation data displays correctly', async () => {
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
      const steps = page
        .locator('[data-test="table-row-0"]')
        .getByRole('cell')
        .filter({ hasText: /^$/ })
        .first();
      await expect(steps).toBeVisible();
    });
  });

  test('Uses the calendar pop-up with random dates, validating UI "X" and "Clear all" buttons and RSC response', async ({
    page,
  }) => {
    await test.step('Open calendar and select a random date range', async () => {
      const calendar = new CalendarHelper(page);
      calendar.opensCalendar();
      await calendar.goToPreviousMonth();
      await calendar.selectRandomDateRange();

      await waitForMultipleRSCResponses(page, 2);
    });

    await test.step('Test "X" button to clear date filter', async () => {
      await page.locator('[data-test="input-remove-value"]').isVisible();
      await page.locator('[data-test="input-remove-value"]').click();
    });

    await test.step('Select another random date range and use "Clear all" button', async () => {
      const calendar = new CalendarHelper(page);
      calendar.opensCalendar();
      await calendar.goToPreviousMonth();
      await calendar.selectRandomDateRange();

      await waitForMultipleRSCResponses(page, 2);

      await page.locator('[data-test="clear-all"]').isVisible();
      await page.locator('[data-test="clear-all"]').click();
    });
  });

  test('Validates there is a warning SVG element after a denied operation', async ({ page }) => {
    await test.step('Find a rejected operation row', async () => {
      const resultsPage = page.locator('#tableBody');

      const rejectedRow = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({
          hasText: /Rejected|Rechazado|Rejeitado/,
        })
        .first();

      await expect(rejectedRow).toBeVisible();
    });

    await test.step('Verify error status elements are displayed correctly', async () => {
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

      const rejectedOperationElement = rejectedRow
        .locator('[data-test^="operationDetail-"]')
        .nth(1);

      await expect(rejectedOperationElement).toHaveAttribute(
        'href',
        expect.stringContaining('?tab=timeline')
      );

      await rejectedOperationElement.focus();
      await expect(rejectedOperationElement).toBeEnabled();
    });
  });

  test('Sees the assets appear inside a listing', async ({ page }) => {
    await test.step('Find and click on Files button', async () => {
      const filesButton = page.getByRole('button', { name: /Files \(\d+\)/ }).first();
      await expect(filesButton).toBeVisible();
      await expect(filesButton).toBeEnabled();

      await filesButton.click();
    });

    await test.step('Verify files modal appears with correct menu items', async () => {
      const filesModal = page.locator('[data-test="option-menu"]');
      await expect(filesModal).toBeVisible();
      await expect(filesModal).toBeEnabled();

      const optionItems = filesModal.locator('button.facephi-ui-option-menu__item');
      const count = await optionItems.count();

      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(6);

      console.log(`Found ${count} option menu items`);
    });
  });

  test('Opens the document modal and validates all buttons @smoke', async ({ page }) => {
    await test.step('Find an operation with status and click on Files button', async () => {
      const resultsPage = page.locator('#tableBody');

      const statusRow = resultsPage
        .locator('[data-test^="table-row-"]')
        .filter({
          hasText: /Rejected|Rechazado|Rejeitado|Successful|Exitosa|Conseguiu/,
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

      const printBttn = page.locator('div:nth-child(3) > button').first();
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
    await test.step('Setup print function interception', async () => {
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
      await Promise.all([printPromise, page.locator('div:nth-child(3) > button').first().click()]);

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
