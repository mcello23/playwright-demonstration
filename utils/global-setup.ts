import { chromium } from '@playwright/test';
import { authenticateWithKeycloak } from '../keycloakAuth.ts';

async function globalSetup() {
  const baseURL = 'https://idv-suite.identity-platform.dev';
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Realiza a autenticação e obtém o token
  const token = await authenticateWithKeycloak();

  // Define o token no localStorage ou como cookie, conforme sua aplicação
  await page.goto(baseURL);
  await page.evaluate(
    ([token]) => {
      localStorage.setItem('access_token', token);
      // Se necessário, configure outros itens do localStorage ou cookies
    },
    [token],
  );

  // Salva o estado de armazenamento (storage state)
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;
