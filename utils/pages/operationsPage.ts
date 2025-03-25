import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';
import { stepPOM, verifyDateRangeInput } from 'utils/controller/e2e';
import { getFormattedDateRange } from 'utils/helpers/calandarHelper';
import { StringsValidationBase, TextAssertion } from 'utils/helpers/miscHelper';
import { operationsTexts } from 'utils/strings/operations-row.strings';

export class operationPageCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  private printPromise: Promise<void> | undefined;

  @stepPOM('Navigates to Operations page')
  async goesToOperations() {
    await this.page.getByRole('link', { name: 'Operations' }).click();
  }

  @stepPOM('Navigates to Operations page')
  async goesToOperationsWait() {
    await this.page.getByRole('link', { name: 'Operations' }).click();
    await this.page.waitForURL('**/operations');
  }

  @stepPOM('Validates Operations page is visible')
  async operationsHeaderVisible() {
    const operationsHeader = this.page
      .locator('[data-test="header"] div')
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
    await this.page.mouse.click(10, 10);
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
    // Date and time format
    const dateRegex = /^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    await expect(this.page.getByText(dateRegex).nth(0)).toBeVisible();
    // Operation ID format
    const operationIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    await expect(this.page.getByText(operationIdRegex).nth(0)).toBeVisible();
    // Type format
    const typeOnboarding = this.page.locator('[data-test="table-row-0"]').getByText('Onboarding');
    await expect(typeOnboarding).toBeVisible();
    // Onboarding steps format
    const steps = this.page
      .locator('[data-test="table-row-0"]')
      .getByRole('cell')
      .filter({ hasText: /^$/ })
      .first();
    await expect(steps).toBeVisible();
  }

  @stepPOM('Finds a rejected operation is visible')
  async findsRejectedOperation() {
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

    const rejectedOperationElement = rejectedRow.locator('[data-test^="operationDetail-"]').nth(1);

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
    const filesButton = this.page.getByRole('button', { name: /Files \(\d+\)/ }).first();
    await expect(filesButton).toBeVisible();
    await expect(filesButton).toBeEnabled();
    await filesButton.click();
  }

  @stepPOM('Validates that the files button listing is visible and contains from 1 to 6 items')
  async validatesFilesButtonAndItems() {
    const filesModal = this.page.locator('[data-test="option-menu"]');
    await expect(filesModal).toBeVisible();
    await expect(filesModal).toBeEnabled();

    const optionItems = filesModal.locator('button.facephi-ui-option-menu__item');
    const count = await optionItems.count();

    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(6);

    console.log(`Found ${count} option menu items`);
  }

  @stepPOM('Find a successful operation and clicks on the files button')
  async clicksOnFilesButton_SuccesOp() {
    const resultsPage = this.page.locator('#tableBody');

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
  }

  @stepPOM('Find any operation that has a Files button and clicks on it')
  async clicksOnFilesButton_AnyOp() {
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

  @stepPOM('Validates that the files listing is visible and contains from 1 to 6 items')
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
    const docBack = this.page
      .locator('div')
      .filter({ hasText: /^Document back$/ })
      .getByRole('button');
    await expect(docBack).toBeVisible();
    await expect(docBack).toBeEnabled();

    const minusZoom = this.page
      .locator('div')
      .filter({ hasText: /^100%$/ })
      .getByRole('button')
      .first();
    await expect(minusZoom).toBeVisible();
    await expect(minusZoom).toBeEnabled();

    const moreZoom = this.page
      .locator('div')
      .filter({ hasText: /^100%$/ })
      .getByRole('button')
      .nth(1);
    await expect(moreZoom).toBeVisible();
    await expect(moreZoom).toBeEnabled();

    const printBttn = this.page.locator('.facephi-ui-flex > div:nth-child(3) > button').first();
    await expect(printBttn).toBeVisible();
    await expect(printBttn).toBeEnabled();

    const downloadBttn = this.page.locator('div:nth-child(3) > button:nth-child(2)').first();
    await expect(downloadBttn).toBeVisible();
    await expect(downloadBttn).toBeEnabled();

    const backBttn = this.page
      .locator('.facephi-ui-modal__base > div > div:nth-child(3) > button')
      .first();
    await expect(backBttn).toBeVisible();
    await expect(backBttn).toBeDisabled();

    const fwdBttn = this.page.locator(
      '.facephi-ui-modal__base > div > div:nth-child(3) > button:nth-child(2)'
    );
    await expect(fwdBttn).toBeVisible();
    await expect(fwdBttn).toBeEnabled();
  }

  @stepPOM('Clicks on the modal back button')
  async clicksOnModalBackButton() {
    const docBack = this.page
      .locator('div')
      .filter({ hasText: /^Document back$/ })
      .getByRole('button');
    await docBack.click();
  }

  @stepPOM('Validates that the modal was closed')
  async validateModalClosed() {
    const modalWindow = this.page.locator('[data-test="modal-oberlay"]');
    await expect(modalWindow).not.toBeVisible();
  }

  @stepPOM('Clicks on the modal download button and logs the downloaded file')
  async validatesModalDownloadButton() {
    const downloadPromise = this.page.waitForEvent('download');

    await this.page.locator('div:nth-child(3) > button:nth-child(2)').first().click();

    const download = await downloadPromise;

    const fileName = download.suggestedFilename();
    expect(fileName).toBeTruthy();

    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    expect('jpeg').toContain(fileExtension);
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
    await this.page
      .locator('[data-test="modal-assets"] button:has(svg[viewBox="0 0 256 256"])')
      .nth(3)
      .click();
    if (this.printPromise) {
      await this.printPromise;
    }
    console.log('Print function was successfully called');
  }

  // Column toggles selector
  @stepPOM('Clicks on column selector')
  async clickOnColumnSelector() {
    await this.page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
    const viewSelector = this.page.locator('[data-test="hide-columns"]');
    await expect(viewSelector).toBeVisible();
  }

  @stepPOM('Sees the available toggles on the column selector')
  async definesAvailableColumns() {
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

    // Selects random columns to toggle
    const columnsToToggle = [];
    const availableIndices = [...Array(availableColumns.length).keys()];
    for (let i = 0; i < numColumnsToToggle; i++) {
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const selectedIndex = availableIndices.splice(randomIndex, 1)[0];
      columnsToToggle.push(availableColumns[selectedIndex]);
    }
  }

  @stepPOM('Selects randomly columns toggles')
  async selectsRandomColumnsToggles() {
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
    const numColumnsToToggle = Math.min(2, Math.floor(Math.random() * 2) + 1);

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
  }

  @stepPOM('Verify columns are not visible')
  async verifyColumnsAreNotVisible() {
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
      const columnHeader = this.page.locator(`th:has-text("${columnLabel}")`);
      await expect(columnHeader).not.toBeVisible();
      console.log(`✅ Column "${columnLabel}" is not visilbe`);
    }
  }
}
export class OperationsStringsValidation extends StringsValidationBase {
  constructor(page: Page) {
    super(page);
  }

  @stepPOM('Navigates to Operations page and locates every string')
  async navigateToOperations(locale: string) {
    await this.page.goto(`/${locale}`, { waitUntil: 'commit' });
    await this.page.locator('[data-test="Operations"]').click();
    await this.page.locator('[data-test="header"]').focus();
  }
  getOperationsAssertions(locale: string): TextAssertion[] {
    const data = (operationsTexts as OperationsTexts)[locale];
    type OperationsTexts = /*unresolved*/ any;

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
        locator: this.page.getByText(data.endDate),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.userID),
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
        locator: this.page.getByText(data.Assets).nth(0),
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
        locator: this.page.getByText(data.sarted).nth(0),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.successful).nth(0),
        isEnabled: false,
      },
      {
        locator: this.page.getByText(data.rejected).nth(0),
        isEnabled: false,
      },
    ];
  }

  @stepPOM('Validate that all strings are visible in the Operations page')
  async validateOperationsTexts(locale: string) {
    const assertions = this.getOperationsAssertions(locale);
    await this.validateTexts(assertions);
  }
}
