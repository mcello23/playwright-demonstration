import { setupServer } from 'msw/node';
import { errorHandlers } from './handlers';

// Configurar servidor MSW
export const server = setupServer(...errorHandlers);

// Helper para iniciar o servidor com erros
export const startErrorServer = () => {
  server.listen({ onUnhandledRequest: 'bypass' });
  console.log('🔶 MSW Error Server iniciado');

  // Adicionar listeners para debug
  server.events.on('request:start', ({ request }) => {
    console.log(`> ${request.method} ${request.url}`);
  });

  server.events.on('response:mocked', ({ request, response }) => {
    console.log(`✅ Resposta simulada: ${request.method} ${request.url} (${response.status})`);
  });

  server.events.on('response:bypass', ({ request }) => {
    console.log(`⏭️ Bypass: ${request.method} ${request.url}`);
  });
};

// Helper para parar o servidor
export const stopServer = () => {
  server.close();
  console.log('🔶 MSW Server encerrado');
};

server.events.on('request:start', ({ request }) => {
  console.log(`> MSW: Requisição iniciada: ${request.method} ${request.url}`);
});

server.events.on('response:mocked', ({ request, response }) => {
  console.log(`✅ MSW: Interceptada: ${request.method} ${request.url} (${response.status})`);
  // Mostrar corpo da resposta para debugging
  response.text().then((body) => console.log(`Corpo: ${body.substring(0, 100)}...`));
});
