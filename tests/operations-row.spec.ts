import { test } from 'utils/controller/e2e';

test.describe('Operations page validation @regression', () => {
  test.beforeEach(async ({ operationPage, dashboardPage }) => {
    await operationPage.goesToOperationsWait(dashboardPage);
  });

  test('Sees all elements in Operations page @smoke', async ({ operationPage }) => {
    await operationPage.validateStaticElements();
    await operationPage.insertsRandomDate();
    await operationPage.insertsRandomNameOnInputSearch();
    await operationPage.selectsFilterButtonAndLabel();
    await operationPage.validatesDateOpIDTypesAndSteps();
  });

  test('Uses the calendar component with random dates, validating UI "X" and "Clear all" buttons and React Server Components (RSC) responses', async ({
    operationPage,
    rscHelpers,
    calendarHelper,
  }) => {
    await calendarHelper.opensCalendar();
    await calendarHelper.goToPreviousMonth();
    await calendarHelper.selectRandomDateRange();

    rscHelpers.waitForMultipleRSCResponses(2);

    await operationPage.clicksOnXButtonToClearInput();

    await calendarHelper.opensCalendar();
    await calendarHelper.goToPreviousMonth();
    await calendarHelper.selectRandomDateRange();

    rscHelpers.waitForMultipleRSCResponses(2);

    await operationPage.clicksOnClearAllButtonToClearInput();
  });

  test('Validates there is a warning SVG element after a denied operation', async ({
    operationPage,
  }) => {
    await operationPage.findsRejectedOperation();
    await operationPage.findsErrorColorAndSVGWarning();
  });

  test('Sees the assets appear listed inside the Files button', async ({ operationPage }) => {
    await operationPage.clicksOnFilesButton();
    await operationPage.validatesFilesButtonAndItems();
  });

  test('Opens the document modal and validates all buttons @smoke', async ({ operationPage }) => {
    await operationPage.clicksOnFilesButton_SuccesOp();
    await operationPage.clicksOnADocument();
    await operationPage.seesImageInsideModal();
    await operationPage.validatesAllModalButtons();
  });

  test('Opens and closes the document modal', async ({ operationPage }) => {
    await operationPage.clicksOnFilesButton_SuccesOp();
    await operationPage.clicksOnADocument();
    await operationPage.seesImageInsideModal();
    await operationPage.clicksOnModalXButton();
    await operationPage.validateModalClosed();
  });

  test('Validates the download button and logs the functionality of the modal asset', async ({
    operationPage,
  }) => {
    await operationPage.clicksOnFilesButton_AnyOp();
    await operationPage.clicksOnADocument();
    await operationPage.seesImageInsideModal();
    await operationPage.validatesModalDownloadButton();
  });

  test('Validates the print button and logs the functionality of the modal asset', async ({
    operationPage,
  }) => {
    await operationPage.setupPrintFunctionInterception();
    await operationPage.clicksOnFilesButton_AnyOp();
    await operationPage.clicksOnADocument();
    await operationPage.seesImageInsideModal();
    await operationPage.clickOnPrintButtonAndValidate();
  });

  test("Validates that the column selector doesn't show unselected toggles", async ({
    operationPage,
  }) => {
    await operationPage.clickOnColumnSelector();
    await operationPage.selectsRandomTooglesAndLogsNotVisibles();
  });

  test('Validates Operations navigation using pagination footer', async ({ operationPage }) => {
    await operationPage.validatePagination();
  });

  test('Validates that Operations URL is randomly changed and it loads correctly, matching inserted number with pagination footer', async ({
    operationPage,
  }) => {
    await operationPage.goesToRandomURL_ValidatesFooter();
  });

  test('Clicks on number page of footer and validates that the spinner disappears @regression', async ({
    operationPage,
  }) => {
    await operationPage.clicksSamePageFooter_ValidatesSpinner();
  });
});
test.describe('Negative tests: Invalid data, wrong operations page validation of error message', () => {
  test.beforeEach(async ({ operationPage, dashboardPage }) => {
    await operationPage.goesToOperationsWait(dashboardPage);
  });
  test('Navigates to unexistent results page of Operations and validates error message', async ({
    operationPage,
    browserName,
  }) => {
    test.skip(
      browserName === 'firefox' && process.env.CI === 'true',
      'Test not supported on Firefox in CI environment'
    );
    await operationPage.goesToRandomURL_ValidatesError();
  });

  test('Inserts random data at input search filter and returns error image', async ({
    operationPage,
  }) => {
    await operationPage.inputsRandomName_ValidatesError();
  });

  test('Inserts an invalid date range at input date filter and returns error image', async ({
    operationPage,
  }) => {
    await operationPage.inputsInvalidDateRange_ValidatesError();
  });
});
