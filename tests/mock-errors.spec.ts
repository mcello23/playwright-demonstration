import { expect, expectNoResponse, test } from '../utils/fixtures/e2e';

test.describe('Mocking server errors and validating behaviour on frontend and console @smoke', () => {
  test('Mocks a 500 (internal server error) and sees it in frontend and console', async ({
    page,
    simulateServerError,
  }, testInfo) => {
    const consoleMessages: string[] = [];
    let errorPrinted = false;

    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);

      if (testInfo.project.name === 'firefox') {
        if (text === 'Error' && !errorPrinted) {
          console.log('\n🔴 Error "500" detected on console (Firefox):'); // Firefox has cookie issues therefore doesn't show the 500 error message
          console.log(text);
          errorPrinted = true;
        }
      } else {
        if (text.includes('Failed to load resource: the server responded with a status of 500')) {
          console.log('\n🔴 Error 500 detected on console:');
          console.log(text);
        }
      }
    });

    await simulateServerError({
      endpoint: '**/operations/**',
      statusCode: 500,
    });

    await page.getByRole('link', { name: 'Operations' }).click();

    const topLogo = page.getByRole('img').first();
    await expect(topLogo).toBeVisible();

    const errorImage = page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();

    const firstErrorText = page.getByText('Something went wrong');
    await expect(firstErrorText).toBeVisible();

    const secondErrorText = page.getByText('Retry later');
    await expect(secondErrorText).toBeVisible();

    const homeButton = page.locator('[data-test="error-button"]').getByText('Land here');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toBeEnabled();

    const error500Message =
      testInfo.project.name === 'firefox'
        ? consoleMessages.find((msg) => msg === 'Error')
        : consoleMessages.find(
            (msg) => msg.includes('Failed to load resource') && msg.includes('500')
          );

    expect(error500Message).toBeTruthy();
  });

  // TODO: modificar el tiempo de espera del token de cognito

  test('Mocks a 401 (Unauthorized) and sees it in frontend and console', async ({
    page,
    simulateUnauthorized,
  }, testInfo) => {
    const consoleMessages: string[] = [];
    let errorPrinted = false;

    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);

      if (testInfo.project.name === 'firefox') {
        if (text === 'Error' && !errorPrinted) {
          console.log('\n🔴 Error "401" detected on console (Firefox):'); // Firefox has cookie issues therefore doesn't show the 401 error message
          console.log(text);
          errorPrinted = true;
        }
      } else {
        if (
          text.includes(
            'Failed to load resource: the server responded with a status of 401 (Unauthorized)'
          )
        ) {
          console.log('\n🔴 Error 401 detected on console:');
          console.log(text);
        }
      }
    });

    await page.waitForURL(/.*tenant.*/);
    const filterElement = page.locator('[data-test="filter-by-date"]');
    await expect(filterElement).toBeVisible();

    await simulateUnauthorized({
      endpoint: '**/operations/**',
      statusCode: 401,
    });

    await page.getByRole('link', { name: 'Operations' }).click();
    await expect(filterElement).not.toBeVisible();

    const error401Message =
      testInfo.project.name === 'firefox'
        ? consoleMessages.find((msg) => msg === 'Error')
        : consoleMessages.find(
            (msg) => msg.includes('Failed to load resource') && msg.includes('401')
          );
    expect(error401Message).toBeTruthy();
  });

  test('Mocks a 403 (Forbidden) response and validates console message and frontend', async ({
    page,
    simulateForbidden,
  }, testInfo) => {
    const consoleMessages: string[] = [];
    let errorPrinted = false;

    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);

      if (testInfo.project.name === 'firefox') {
        if (text === 'Error' && !errorPrinted) {
          console.log('\n🔴 Error "403" detected on console (Firefox):'); // Firefox has cookie issues therefore doesn't show the 403 error message
          console.log(text);
          errorPrinted = true;
        }
      } else {
        if (
          text.includes(
            'Failed to load resource: the server responded with a status of 403 (Forbidden)'
          )
        ) {
          console.log('\n🔴 Error 403 detected on console:');
          console.log(text);
        }
      }
    });

    await page.waitForURL(/.*tenant.*/);
    const filterElement = page.locator('[data-test="filter-by-date"]');
    await expect(filterElement).toBeVisible();

    await simulateForbidden({
      endpoint: '**/operations/**',
      statusCode: 403,
    });

    await page.getByRole('link', { name: 'Operations' }).click();

    const firstErrorText = page.getByText('Something went wrong');
    await expect(firstErrorText).toBeVisible();

    const error403Message =
      testInfo.project.name === 'firefox'
        ? consoleMessages.find((msg) => msg === 'Error')
        : consoleMessages.find(
            (msg) => msg.includes('Failed to load resource') && msg.includes('403')
          );

    expect(error403Message).toBeTruthy();
  });

  test('Mocks a 408 (request timeout) response and validates through unresponsive navigation', async ({
    page,
    simulateTimeout,
  }) => {
    const timeoutMessages: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('timeout') || text.includes('Timeout') || text.includes('exceeded')) {
        timeoutMessages.push(text);
        console.log('\n⏱️ Timeout message detected:');
        console.log(text);
      }
    });

    await page.waitForURL(/.*tenant.*/);
    const filterElement = page.locator('[data-test="filter-by-date"]');
    await expect(filterElement).toBeVisible();

    await simulateTimeout({
      endpoint: '**/tenant/**',
      timeoutMs: 30000,
    });

    await page.getByRole('link', { name: 'Operations' }).click();

    const opElement = page.locator('[data-test="header"]').getByText('Operations');

    await page.waitForTimeout(1000);

    await expectNoResponse(page, '**/tenant/**');

    await expect(opElement).not.toBeVisible({
      timeout: 1000,
    });

    console.log('\n⏱️ Mocked timeout successful!');
  });
});
