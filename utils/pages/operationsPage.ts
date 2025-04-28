import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';
import { stepPOM, verifyDateRangeInput } from 'utils/controller/e2e';
import { getFormattedDateRange } from 'utils/helpers/calandarHelper';
import { StringsValidationBase, TextAssertion } from 'utils/helpers/miscHelper';
import { operationsTexts } from 'utils/strings/operations-row.strings';
import { dashboardCommands } from './dashboardPage';

export class operationPageCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  private printPromise: Promise<void> | undefined;

  @stepPOM('Navigates to Operations page')
  async goesToOperations(dashboardPage: dashboardCommands) {
    await dashboardPage.loadsURL();
    await this.page.getByRole('link', { name: 'Operations' }).click();
  }

  @stepPOM('Navigates to Operations page')
  async goesToOperationsSkipTutorial(dashboardPage: dashboardCommands) {
    await dashboardPage.loadsURLSkipsTutorial();
    await this.page.getByRole('link', { name: 'Operations' }).click();
  }

  @stepPOM('Navigates to Operations page')
  async goesToOperationsWait(dashboardPage: dashboardCommands) {
    await dashboardPage.loadsURLSkipsTutorial();
    await this.page.getByRole('link', { name: 'Operations' }).click();
    await this.page.waitForURL('**/operations');
  }

  @stepPOM('Validates Operations page is visible')
  async operationsHeaderVisible() {
    const operationsHeader = this.page
      .locator('[data-test="header-title"]')
      .filter({ hasText: 'Operations' });
    await expect(operationsHeader).toBeVisible();
  }

  // Static elements
  // Operations row
  @stepPOM('Validate static elements visibility and interactivity')
  async validateStaticElements() {
    await expect(this.page.locator('[data-test="filter-by-date"]')).toBeVisible();
    await expect(this.page.locator('[data-test="filter-by-date"]')).toBeEnabled();
    await expect(this.page.locator('[data-test="filter-by-search"]')).toBeVisible();
    await expect(this.page.locator('[data-test="filter-by-search"]')).toBeEnabled();
    await expect(this.page.locator('[data-test="filter-button"]')).toBeVisible();
    await expect(this.page.locator('[data-test="filter-button"]')).toBeEnabled();
  }
  @stepPOM('Inserts random date on input and validates it')
  async insertsRandomDate() {
    const formattedDate = getFormattedDateRange();

    const filterByDateLocator = this.page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDate);
    await filterByDateLocator.press('Enter');
    await filterByDateLocator.focus();
    await verifyDateRangeInput(filterByDateLocator, formattedDate);
  }

  @stepPOM('Inserts random name, sees clear button, clicks it and validates input is empty')
  async insertsRandomNameOnInputSearch() {
    const randomName = faker.person.firstName();
    await this.page.locator('[data-test="filter-by-search"]').fill(randomName);
    await expect(this.page.locator('[data-test="clear-all"]')).toBeVisible();
    await this.page.locator('[data-test="clear-all"]').click();
    await expect(this.page.locator('[data-test="filter-by-search"]')).not.toHaveValue(randomName);
  }

  @stepPOM('Validates that the filter button works by selecting a label')
  async selectsFilterButtonAndLabel() {
    await this.page.locator('[data-test="filter-button"]').click();
    await this.page.getByLabel('Onboarding').click();
    const buttonChecked = this.page.locator('[data-test="filter-option-ONBOARDING"] label').first();
    await expect(buttonChecked).toHaveAttribute('aria-checked', 'true');
    await this.page.locator('[data-test="closeable-chips"]').click({ force: true });
  }

  @stepPOM('Sees the "X" button is visible and clicks it')
  async clicksOnXButtonToClearInput() {
    await this.page.locator('[data-test="input-remove-value"]').isVisible();
    await this.page.locator('[data-test="input-remove-value"]').click();
    const filterByDate = this.page.locator('[data-test="filter-by-date"]');
    await expect(filterByDate).toBeEmpty();
  }

  @stepPOM('Sees the "Clear all" button is visible and clicks it')
  async clicksOnClearAllButtonToClearInput() {
    await this.page.locator('[data-test="clear-all"]').isVisible();
    await this.page.locator('[data-test="clear-all"]').click();
    const filterByDate = this.page.locator('[data-test="filter-by-date"]');
    await expect(filterByDate).toBeEmpty();
  }

  @stepPOM(
    'Validates expected Date and Time, Operation ID, Type and Onboarding Steps formats are seen in the UI'
  )
  async validatesDateOpIDTypesAndSteps() {
    // Start date and time format
    const startDateRegex = /^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    await expect(this.page.getByText(startDateRegex).nth(0)).toBeVisible();

    // End date and time format
    const endDateRegex = /^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    await expect(this.page.getByText(endDateRegex).nth(1)).toBeVisible();

    // Operation ID format
    // const operationIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    // await expect(this.page.getByText(operationIdRegex).nth(0)).toBeVisible();

    // Email (User ID) format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    await expect(this.page.getByText(emailRegex).nth(2)).toBeVisible();

    // Type format
    const typeOnboarding = this.page.locator('[data-test="table-row-0"]').getByText(/Onboarding/);
    await expect(typeOnboarding).toBeVisible();
    // Onboarding steps format
    const steps = this.page
      .locator('[data-test="table-row-0"]')
      .getByRole('cell')
      .filter({ hasText: /^$/ })
      .first();
    await expect(steps).toBeVisible();
  }

  @stepPOM('Finds a rejected operation')
  async findsRejectedOperation() {
    await this.page.locator('[data-test="filter-button"]').click();
    const rejectedToggle = this.page.getByLabel('Rejected');
    await rejectedToggle.click();
    await this.page.evaluate(() => {
      const overlay = document.querySelector('#popup-root div:nth-child(1)');
      if (overlay) overlay.remove();
    });
    const resultsPage = this.page.locator('#tableBody');

    const rejectedRow = resultsPage
      .locator('[data-test^="table-row-"]')
      .filter({
        hasText: /Rejected|Rechazado|Rejeitado/,
      })
      .first();

    await expect(rejectedRow).toBeVisible();
  }

  @stepPOM('Validates that the error color and SVG warning are visible')
  async findsErrorColorAndSVGWarning() {
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

    const rejectedOperationElement = rejectedRow.locator('[data-test^="operationDetail-"]').first();

    await expect(rejectedOperationElement).toHaveAttribute(
      'href',
      expect.stringContaining('?tab=timeline')
    );

    await rejectedOperationElement.focus();
    await expect(rejectedOperationElement).toBeEnabled();
  }

  // Files listing
  @stepPOM('Clicks on a operation that has assests available')
  async clicksOnFilesButton() {
    await this.page.locator('[data-test="filter-button"]').click();
    await this.page.getByLabel('Succesful').click(); // TODO: report typo
    await this.page.getByLabel('Rejected').click();
    await this.page.evaluate(() => {
      const overlay = document.querySelector('#popup-root div:nth-child(1)');
      if (overlay) overlay.remove();
    });
    const filesButton = this.page.getByRole('button', { name: /Files \(\d+\)/ }).first();
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    await filesButton.click();
  }

  @stepPOM('Validates that the files button listing is visible and contains from 1 to 8 items')
  async validatesFilesButtonAndItems() {
    const filesModal = this.page.locator('[data-test="option-menu"]');
    await expect(filesModal).toBeVisible();
    await expect(filesModal).toBeEnabled();

    const optionItems = filesModal.locator('button.facephi-ui-option-menu__item');
    const count = await optionItems.count();

    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(8);

    console.log(`Found ${count} option menu items`);
  }

  @stepPOM('Finds a successful operation and clicks on the files button')
  async clicksOnFilesButton_SuccesOp() {
    await this.page.locator('[data-test="filter-button"]').click();
    await this.page.getByLabel('Succesful').click(); // TODO: report typo
    await this.page.evaluate(() => {
      const overlay = document.querySelector('#popup-root div:nth-child(1)');
      if (overlay) overlay.remove();
    });
    const resultsPage = this.page.locator('#tableBody');

    const statusRow = resultsPage
      .locator('[data-test^="table-row-"]')
      .filter({
        hasText: /Successful/,
      })
      .first();

    const filesButton = statusRow.getByRole('button', { name: /Files/ });
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();

    await filesButton.click();
  }

  @stepPOM('Find any operation that has a Files button and clicks on it')
  async clicksOnFilesButton_AnyOp() {
    await this.page.locator('[data-test="filter-button"]').click();
    await this.page.getByLabel('Succesful').click(); // TODO: report typo
    await this.page.evaluate(() => {
      const overlay = document.querySelector('#popup-root div:nth-child(1)');
      if (overlay) overlay.remove();
    });
    const resultsPage = this.page.locator('#tableBody');

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
  }

  @stepPOM('Validates that the files listing is visible and contains from 1 to 8 items')
  async clicksOnADocument() {
    const filesModal = this.page.locator('button.facephi-ui-option-menu__item').nth(0);
    await filesModal.click();
  }

  // Modal
  @stepPOM('Validates that the modal appears with an image')
  async seesImageInsideModal() {
    await expect(this.page.locator('[data-test="modal-assets"]')).toBeVisible();
    const modalAssets = this.page.locator('[data-test="modal-assets"] img');
    await expect(modalAssets).toBeVisible();
  }

  @stepPOM('Validates all modal control buttons are visible and enabled/disabled')
  async validatesAllModalButtons() {
    const modalContent = this.page.locator('[data-test="modal-assets"]');
    if (await modalContent.locator('button:has-text("Selfie")').isVisible()) {
      await modalContent.locator('button:has-text("Selfie")').isEnabled();
    } else if (await modalContent.locator('button:has-text("Document back")').isVisible()) {
      await modalContent.locator('button:has-text("Document back")').isEnabled();
    } else if (
      await modalContent.locator('button:has-text("Document back fullframe")').isVisible()
    ) {
      await modalContent.locator('button:has-text("Document back fullframe")').isEnabled();
    } else {
      console.log('Specified back buttons not found inside modal.');
    }

    const minusZoom = this.page
      .locator('div')
      .filter({ hasText: /^100%$/ })
      .getByRole('button')
      .first();
    await expect(minusZoom).toBeVisible();
    await expect(minusZoom).toBeDisabled();

    const moreZoom = this.page
      .locator('div')
      .filter({ hasText: /^100%$/ })
      .getByRole('button')
      .nth(3);
    await expect(moreZoom).toBeVisible();
    await expect(moreZoom).toBeEnabled();

    const printBttn = this.page.locator('section:nth-child(2) > div > button').first();
    await expect(printBttn).toBeVisible();
    await expect(printBttn).toBeEnabled();

    const downloadBttn = this.page.locator('section:nth-child(2) > div > button').first();
    await expect(downloadBttn).toBeVisible();
    await expect(downloadBttn).toBeEnabled();

    const backBttn = this.page.locator('section:nth-child(2) > div > button').first();
    await expect(backBttn).toBeVisible();
    await expect(backBttn).toBeEnabled();

    const fwdBttn = this.page.locator(
      'section:nth-child(2) > div:nth-child(2) > button:nth-child(3)'
    );
    await expect(fwdBttn).toBeVisible();
  }

  @stepPOM('Clicks on the "X" button')
  async clicksOnModalXButton() {
    await this.page.locator('button:nth-child(3)').first().click();
  }

  @stepPOM('Validates that the modal was closed')
  async validateModalClosed() {
    const modalWindow = this.page.locator('[data-test="modal-assets"]');
    await expect(modalWindow).not.toBeVisible();
  }

  @stepPOM('Clicks on the modal download button and logs the downloaded file')
  async validatesModalDownloadButton() {
    const downloadPromise = this.page.waitForEvent('download');

    await this.page.locator('section:nth-child(2) > div > button:nth-child(2)').first().click();

    const download = await downloadPromise;

    const fileName = download.suggestedFilename();
    expect(fileName).toBeTruthy();

    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpeg', 'jpg', 'png'];
    expect(allowedExtensions).toContain(fileExtension);
    console.log(`Downloaded file: ${fileName}`);

    const path = await download.path();
    expect(path).toBeTruthy();
  }

  @stepPOM('Setup print function interception')
  async setupPrintFunctionInterception(): Promise<void> {
    this.printPromise = new Promise<void>((resolve) => {
      this.page.exposeFunction('notifyPrintCalled', () => {
        resolve();
      });
    });

    await this.page.addInitScript(() => {
      const originalPrint = window.print;
      window.print = () => {
        // Call original function
        // And prevents opening the real print windows by commenting:
        // originalPrint.call(window);

        // @ts-ignore
        window.notifyPrintCalled();
      };
    });
  }

  @stepPOM('Click on print button and validate')
  async clickOnPrintButtonAndValidate(): Promise<void> {
    await this.page.locator('section:nth-child(2) > div > button').first().click();
    if (this.printPromise) {
      await this.printPromise;
    }
    console.log('Print function was successfully called');
  }

  // Column toggles selector
  @stepPOM('Clicks on column selector')
  async clickOnColumnSelector() {
    await this.page.locator('[data-test="hide-columns"]').click();
    const viewSelector = this.page.locator('[data-test="hide-columns"]');
    await expect(viewSelector).toBeVisible();
  }

  @stepPOM('Selects randomly columns toggles')
  async selectsRandomTooglesAndLogsNotVisibles() {
    const availableColumns = [
      'Start Date',
      'Operation ID',
      'User ID',
      'Document number',
      /Name/,
      /Surname/,
      'Type',
      'Steps',
      'Assets',
      'Status',
      'Actions',
    ];
    const numColumnsToToggle = 3;

    // Select random columns to toggle
    const columnsToToggle = [];
    const availableIndices = [...Array(availableColumns.length).keys()];
    for (let i = 0; i < numColumnsToToggle; i++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
      columnsToToggle.push(availableColumns[selectedIndex]);
    }
    const viewSelector = this.page.locator('[data-test="option-menu"]');
    for (const columnLabel of columnsToToggle) {
      console.log(`Removing column: ${columnLabel}`);
      await viewSelector.getByLabel(columnLabel).click();
    }
    await this.page.mouse.click(0, 0);

    await expect(viewSelector).not.toBeVisible();

    for (const columnLabel of columnsToToggle) {
      const columnHeader = this.page.locator(`th:has-text("${columnLabel}")`);
      await expect(columnHeader).not.toBeVisible();
      console.log(`✅ Column "${columnLabel}" is not visilbe`);
    }
  }

  @stepPOM('Validates pagination of Operations page by clicking on the next page button')
  async validatePagination() {
    await this.page.waitForSelector('[data-test="next-page"]', { state: 'visible' });
    console.log('Clicks on page 2...');
    await this.page.locator('[data-test="next-page"]').click();

    await this.page.waitForURL('**/operations?to=**');
    await this.page.waitForSelector('#tableBody', { state: 'visible' });

    expect(this.page.url()).toMatch(/\/operations\?to=/);
    console.log(`URL now is: ${this.page.url()}`);

    await this.page.waitForSelector('[data-test="next-page"]', { state: 'visible' });
    console.log('Clicks on page 3...');
    await this.page.locator('[data-test="next-page"]').click();

    await this.page.waitForURL('**/operations?to=**');
    await this.page.waitForSelector('#tableBody', { state: 'visible' });

    expect(this.page.url()).toMatch(/\/operations\?to=/);
    console.log(`URL now is: ${this.page.url()}`);
  }

  @stepPOM('Navigates to random page number via URL and validates it')
  async goesToRandomURL_ValidatesFooter() {
    const currentUrl = this.page.url();
    const url = new URL(currentUrl);
    const pageNumber = faker.number.int({ min: 3, max: 19 });

    url.searchParams.set('page', pageNumber.toString());

    const newUrl = url.toString();
    console.log(`Navigating to page ${pageNumber} via URL: ${newUrl}`);

    await this.page.goto(newUrl, { waitUntil: 'networkidle' });

    await this.page.waitForURL(newUrl);
    await this.page.waitForSelector('#tableBody', { state: 'visible' });

    expect(this.page.url()).toContain(`page=${pageNumber}`);
    console.log(`Successfully navigated to page ${pageNumber}`);
    const paginationButton = this.page.locator(`[data-test="page-${pageNumber}"]`);
    await expect(paginationButton).toBeVisible();
    console.log(`URL page matches pagination number ${paginationButton}`);
  }

  @stepPOM('Navigates to invalid random page number via URL and error message')
  async goesToRandomURL_ValidatesError() {
    const browser = this.page.context().browser();
    const browserName = browser?.browserType().name();

    if (browserName === 'firefox' && process.env.CI === 'true') {
      console.warn('⚠️ Test not supported on Firefox due to cookies restrictions. Skipping test.');
      return;
    }

    const baseUrl = 'https://idv-suite.identity-platform.dev/en/tenant/idv-demo/operations';

    const randomDate = faker.date.recent({ days: 7 });
    const isoTimestamp = randomDate.toISOString();
    const encodedTimestamp = encodeURIComponent(isoTimestamp);
    const pageNumber = faker.number.int({ min: 160, max: 300 });
    const newUrl = `${baseUrl}?to=${encodedTimestamp}&page=${pageNumber}`;

    console.log(`Navigating to invalid URL: ${newUrl}`);

    try {
      await this.page.goto(newUrl, { waitUntil: 'commit' });
    } catch (e: any) {
      console.warn(`Navigation potentially aborted (expected for invalid page): ${e.message}`);
    }

    console.log(`Current URL after navigation attempt: ${this.page.url()}`);

    console.log(`Attempting UI validation for error state...`);
    try {
      const errorImageLocator = this.page.getByRole('img', { name: 'No results for this filter' });
      await expect(errorImageLocator).toBeVisible();

      await expect(this.page.locator('#tableBody')).not.toBeVisible();

      await expect(this.page.locator('[data-test="empty-state-test"] div').first())
        .toMatchAriaSnapshot(`
        - img "No results for this filter image"
        - paragraph: No results found for this filter
        - paragraph: Try adjusting the filters or check back later for new results
        `);
      console.log('Error message UI elements validated successfully.');
    } catch (uiError: any) {
      console.error(`UI validation failed after navigation attempt. Error: ${uiError.message}`);
      throw uiError;
    }
  }

  @stepPOM('Inputs an invalid name and validates error message')
  async inputsRandomName_ValidatesError() {
    const randomName = faker.lorem.words();
    await this.page.locator('[data-test="filter-by-search"]').fill(randomName);
    await expect(this.page.locator('#tableBody')).not.toBeVisible();
    await expect(this.page.getByRole('img', { name: 'No results for this filter' })).toBeVisible();

    await expect(this.page.locator('[data-test="empty-state-test"] div').first())
      .toMatchAriaSnapshot(`
      - img "No results for this filter image"
      - paragraph: No results found for this filter
      - paragraph: Try adjusting the filters or check back later for new results
      `);

    console.log('Error message is visible');
  }

  @stepPOM('Inputs an invalid date range and validates error message')
  async inputsInvalidDateRange_ValidatesError() {
    const invalidDateRange = '01/01/2019 - 03/11/2019';

    console.log(`Inputting invalid date range: ${invalidDateRange}`);

    const dateInput = this.page.locator('[data-test="filter-by-date"]');
    await dateInput.fill(invalidDateRange);
    await this.page.mouse.click(0, 0);

    await expect(this.page.locator('#tableBody')).not.toBeVisible({ timeout: 10000 });
    await expect(this.page.getByRole('img', { name: 'No results for this filter' })).toBeVisible();

    await expect(this.page.locator('[data-test="empty-state-test"] div').first())
      .toMatchAriaSnapshot(`
      - img "No results for this filter image"
      - paragraph: No results found for this filter
      - paragraph: Try adjusting the filters or check back later for new results
      `);

    console.log('Error message is visible');
  }

  @stepPOM('Clicks on footer page and validates that the loading spinner is not visible')
  async clicksSamePageFooter_ValidatesSpinner() {
    await this.page.locator('[data-test="page-1"]').click();
    await expect(this.page.locator('.facephi-ui-spinner__spinner')).not.toBeVisible();
  }
}

export class OperationsStringsValidation extends StringsValidationBase {
  constructor(page: Page) {
    super(page);
  }

  @stepPOM('Navigates to Operations page and locates every string')
  async navigateToOperations(locale: string) {
    await this.page.goto(`/${locale}`, { waitUntil: 'commit' });
    await this.page.locator('[data-test="welcome-modal-skip-button"]').click();
    await this.page.locator('[data-test="Operations"]').click();
    await this.page.locator('[data-test="header"]').focus();
    await this.page.locator('[data-test="hide-columns"]').click();
    const optionMenu = this.page.locator('[data-test="option-menu"] [role="listitem"]');
    const count = await optionMenu.count();

    for (let i = 0; i < count; i++) {
      const item = optionMenu.nth(i);
      const checkbox = item.locator('input[type="checkbox"]');
      const isChecked = await checkbox.isChecked();
      if (!isChecked) {
        await checkbox.click();
        console.log(`Item ${i} is now checked and visible in operations page`);
      }
    }
    await this.page.mouse.click(0, 0);
  }

  getOperationsAssertions(locale: string): TextAssertion[] {
    const data = (operationsTexts as OperationsTexts)[locale];
    type OperationsTexts = any;

    return [
      {
        locator: this.page.locator('[data-test="header"]').getByText(data.title),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.startDate),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.operationID),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.userID),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.docNumber),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.name),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.surname),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.type),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.steps),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.assets).nth(0),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.status),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.actions),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.started).nth(0),
        isEnabled: false,
      },
      // {
      //   locator: this.page.getByText(data.successful).nth(0),
      //   isEnabled: false,
      // },
      // {
      //   locator: this.page.getByText(data.rejected).nth(0),
      //   isEnabled: false,
      // },
    ];
  }

  @stepPOM('Validate that all strings are visible in the Operations page')
  async validateOperationsTexts(locale: string) {
    const assertions = this.getOperationsAssertions(locale);
    await this.validateTexts(assertions);
  }
}
