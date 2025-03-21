import { expect, test } from '../utils/controller/e2e';

test.describe('Mocking server errors and validating behaviour on frontend and console @smoke', () => {
  test('Mocks a 500 (internal server error) and sees it in frontend and console', async ({
    page,
    mockHelpers,
  }, testInfo) => {
    const consoleMessages: string[] = [];
    let errorPrinted = false;

    await test.step('Set up console message listening', async () => {
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
    });

    await test.step('Simulate server error', async () => {
      await mockHelpers.simulateServerError({
        endpoint: '**/operations/**',
        statusCode: 500,
      });
    });

    await test.step('Navigate to trigger the error', async () => {
      await page.getByRole('link', { name: 'Operations' }).click();
    });

    await test.step('Validate error page UI elements', async () => {
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
    });

    await test.step('Validate console error message', async () => {
      const error500Message =
        testInfo.project.name === 'firefox'
          ? consoleMessages.find((msg) => msg === 'Error')
          : consoleMessages.find(
              (msg) => msg.includes('Failed to load resource') && msg.includes('500')
            );

      expect(error500Message).toBeTruthy();
    });
  });

  // TODO: modificar o tempo de espera do token de cognito

  test('Mocks a 401 (Unauthorized) and sees it in frontend and console', async ({
    page,
    mockHelpers,
  }, testInfo) => {
    const consoleMessages: string[] = [];
    let errorPrinted = false;

    await test.step('Set up console message listening', async () => {
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
    });

    await test.step('Wait for initial page load', async () => {
      await page.waitForURL(/.*tenant.*/);
      const filterElement = page.locator('[data-test="filter-by-date"]');
      await expect(filterElement).toBeVisible();
    });

    await test.step('Simulate unauthorized response', async () => {
      await mockHelpers.simulateUnauthorized({
        endpoint: '**/operations/**',
        statusCode: 401,
      });
    });

    await test.step('Navigate to trigger the error', async () => {
      await page.getByRole('link', { name: 'Operations' }).click();
    });

    await test.step('Validate UI changes', async () => {
      const filterElement = page.locator('[data-test="filter-by-date"]');
      await expect(filterElement).not.toBeVisible();
    });

    await test.step('Validate console error message', async () => {
      const error401Message =
        testInfo.project.name === 'firefox'
          ? consoleMessages.find((msg) => msg === 'Error')
          : consoleMessages.find(
              (msg) => msg.includes('Failed to load resource') && msg.includes('401')
            );
      expect(error401Message).toBeTruthy();
    });
  });

  test('Mocks a 403 (Forbidden) response and validates console message and frontend', async ({
    page,
    mockHelpers,
  }, testInfo) => {
    const consoleMessages: string[] = [];
    let errorPrinted = false;

    await test.step('Set up console message listening', async () => {
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
    });

    await test.step('Wait for initial page load', async () => {
      await page.waitForURL(/.*tenant.*/);
      const filterElement = page.locator('[data-test="filter-by-date"]');
      await expect(filterElement).toBeVisible();
    });

    await mockHelpers.simulateForbidden({
      endpoint: '**/operations/**',
      statusCode: 403,
    });

    await test.step('Navigate to trigger the error', async () => {
      await page.getByRole('link', { name: 'Operations' }).click();
    });

    await test.step('Validate error UI elements', async () => {
      const firstErrorText = page.getByText('Something went wrong');
      await expect(firstErrorText).toBeVisible();
    });

    await test.step('Validate console error message', async () => {
      const error403Message =
        testInfo.project.name === 'firefox'
          ? consoleMessages.find((msg) => msg === 'Error')
          : consoleMessages.find(
              (msg) => msg.includes('Failed to load resource') && msg.includes('403')
            );

      expect(error403Message).toBeTruthy();
    });
  });

  test('Mocks a 408 (request timeout) response and validates through unresponsive navigation', async ({
    page,
    mockHelpers,
    errorCommands,
  }) => {
    const timeoutMessages: string[] = [];

    await test.step('Set up console message listening', async () => {
      page.on('console', (msg) => {
        const text = msg.text();
        if (text.includes('timeout') || text.includes('Timeout') || text.includes('exceeded')) {
          timeoutMessages.push(text);
          console.log('\n⏱️ Timeout message detected:');
          console.log(text);
        }
      });
    });

    await test.step('Wait for initial page load', async () => {
      await page.waitForURL(/.*tenant.*/);
      const filterElement = page.locator('[data-test="filter-by-date"]');
      await expect(filterElement).toBeVisible();
    });

    await mockHelpers.simulateTimeout({
      endpoint: '**/tenant/**',
      timeoutMs: 30000,
    });

    await test.step('Navigate to trigger the timeout', async () => {
      await page.getByRole('link', { name: 'Operations' }).click();
    });

    await test.step('Verify timeout behavior', async () => {
      const opElement = page.locator('[data-test="header"]').getByText('Operations');
      await page.waitForTimeout(1000);
      await errorCommands.expectNoResponse(page, '**/tenant/**');
      await expect(opElement).not.toBeVisible({
        timeout: 1000,
      });
    });

    await test.step('Log timeout confirmation', async () => {
      console.log('\n⏱️ Mocked timeout successful!');
    });
  });
});
