import { expect, test } from 'utils/controller/e2e';

test.beforeEach(async ({ dashboardPage }) => {
  await dashboardPage.loadsMainURL();
});

test.describe('Mocking server errors and validating behaviour on frontend and console @smoke', () => {
  test('Mocks a 500 (internal server error) and sees it in frontend and console', async ({
    mockHelpers,
    operationPage,
    errorPage,
  }, testInfo) => {
    const consoleMessages = await mockHelpers.listenForErrorInConsole(testInfo, 500);

    mockHelpers.simulateHttpError({
      endpoint: '**/operations/**',
      statusCode: 500,
    });

    await operationPage.goesToOperations();

    await errorPage.validatesErrorMockedPageUI();

    const error500Message = consoleMessages.find(
      (msg) => msg.includes('500') || (testInfo.project.name === 'firefox' && msg === 'Error')
    );
    expect(error500Message).toBeTruthy();
  });

  test('Mocks a 401 (Unauthorized) and sees it in frontend and console', async ({
    mockHelpers,
    operationPage,
    errorPage,
  }, testInfo) => {
    const consoleMessages = await mockHelpers.listenForErrorInConsole(testInfo, 401);

    mockHelpers.simulateHttpError({
      endpoint: '**/operations/**',
      statusCode: 401,
    });

    await operationPage.goesToOperations();

    await errorPage.validatesErrorMockedPageUI();

    const error401Message = consoleMessages.find(
      (msg) => msg.includes('401') || (testInfo.project.name === 'firefox' && msg === 'Error')
    );
    expect(error401Message).toBeTruthy();
  });

  test('Mocks a 403 (Forbidden) and sees it in frontend and console', async ({
    mockHelpers,
    operationPage,
    errorPage,
  }, testInfo) => {
    const consoleMessages = await mockHelpers.listenForErrorInConsole(testInfo, 403);

    await mockHelpers.simulateHttpError({
      endpoint: '**/operations/**',
      statusCode: 403,
    });

    await operationPage.goesToOperations();

    await errorPage.validatesErrorMockedPageUI();

    const error403Message = consoleMessages.find(
      (msg) => msg.includes('403') || (testInfo.project.name === 'firefox' && msg === 'Error')
    );
    expect(error403Message).toBeTruthy();
  });

  test('Mocks a 408 (request timeout) and validates through unresponsive navigation', async ({
    mockHelpers,
    operationPage,
  }, testInfo) => {
    const consoleMessages = await mockHelpers.listenForErrorInConsole(testInfo, 408);

    await mockHelpers.simulateHttpError({
      endpoint: '**/operations/**',
      statusCode: 408,
      message: 'Request Timeout',
    });

    await operationPage.goesToOperations();
    await mockHelpers.validateTimeoutBehavior();

    const timeoutMessage = consoleMessages.find(
      (msg) =>
        msg.includes('408') ||
        msg.includes('Timeout') ||
        msg.includes('timeout') ||
        (testInfo.project.name === 'firefox' && msg === 'Error')
    );
    expect(timeoutMessage).toBeTruthy();
  });
});
