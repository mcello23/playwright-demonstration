import { expect, test } from '../utils/fixtures/e2e';

test('Mocks a 500 server error and sees it in frontend and console', async ({
  page,
  simulateServerError,
}, testInfo) => {
  if (testInfo.project.name === 'firefox') {
    test.skip(true, 'This test is flaky on Firefox');
    return;
  }

  const consoleMessages: string[] = [];

  page.on('console', (msg) => {
    const text = msg.text();
    consoleMessages.push(text);
    if (text.includes('Failed to load resource: the server responded with a status of 500')) {
      console.log('\n🔴 Error 500 detected on console:');
      console.log(text);
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

  const error500Message = consoleMessages.find((msg) =>
    msg.includes('Failed to load resource: the server responded with a status of 500')
  );

  expect(error500Message).toBeTruthy();
});

// TODO: 403, 401, modificar el tiempo de espera del token de cognito

test('Mocks a timeout server response and validates through unrespsonsive navigation', async ({
  page,
  simulateTimeout,
}) => {
  // Capturar mensagens específicas de timeout no console
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

  let navigationAttempted = false;
  page.on('framenavigated', () => {
    navigationAttempted = true;
  });

  await page.getByRole('link', { name: 'Operations' }).click();

  expect(navigationAttempted, 'Trying to navigate after mocked timeout...').toBeFalsy();

  const opElement = page.locator('[data-test="header"]').getByText('Operations');
  await expect(opElement).not.toBeVisible({
    timeout: 2000,
  });
  console.log('\n⏱️ Mocked timeout successful!');
});
