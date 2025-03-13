import { expect, test } from '../utils/fixtures/e2e';

test('Deve mostrar mensagem de erro quando servidor retorna 500', async ({
  page,
  simulateServerError,
}) => {
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

  if (error500Message && !console.log.toString().includes('Error 500 detected')) {
    console.log('\n🔴 Error message captured:');
    console.log(error500Message);
  }
});

// TODO: 403, 401, modificar el tiempo de espera

test('Deve mostrar mensagem de timeout quando requisição demora muito', async ({
  page,
  simulateTimeout,
}) => {
  // Configurar o timeout antes de navegar para a página
  await simulateTimeout({
    endpoint: '**/operations/**',
    timeoutMs: 30000,
  });

  // Navegar para a página
  await page.goto('/operations');

  // Verificar se mensagem de timeout é exibida
  const timeoutMessage = page.locator('[data-test="timeout-message"]');
  await expect(timeoutMessage).toBeVisible();
  await expect(timeoutMessage).toContainText('A operação excedeu o tempo limite');
});
