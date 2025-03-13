import { test as baseTest } from '@playwright/test';
import { startErrorServer, stopServer } from '../mocks/msw-setup';

// Fixture que inicia o MSW antes dos testes
export const mswTest = baseTest.extend({
  // Iniciar servidor MSW antes de cada teste
  page: async ({ page }, use) => {
    // Configurar monitoramento de erros
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`🚨 Console Error: ${msg.text()}`);
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      console.log(`🚨 Page Error: ${error.message}`);
      errors.push(error.message);
    });

    // Iniciar servidor MSW para interceptar requisições
    startErrorServer();

    // Usar a página
    await use(page);

    // Parar servidor MSW
    stopServer();

    // Verificar se houve erros (opcional)
    if (errors.length > 0) {
      console.log(`Foram capturados ${errors.length} erros durante o teste`);
    }
  },
});

export { expect } from '@playwright/test';
