import { http, HttpResponse } from 'msw';

// Handlers para simular erros em diferentes tipos de requisições
export const errorHandlers = [
  // ----- PARTE 1: HANDLERS GRAPHQL -----
  // Interceptar qualquer operação GraphQL, incluindo WebSockets
  // Interceptar especificamente o WebSocket GraphQL
  // Replace the WebSocket handler to target HTTPS
  http.get('https://v3.identity-platform.dev/graphql', ({ request }) => {
    const upgradeHeader = request.headers.get('Upgrade');
    // Check if it's a WebSocket handshake
    if (upgradeHeader === 'websocket') {
      console.log('🔴 MSW: Intercepted WebSocket handshake');
      return new HttpResponse(null, { status: 503 });
    }
    // Allow non-WebSocket requests to proceed
    return;
  }),

  // Interceptar também a versão HTTP para garantir
  http.all('https://v3.identity-platform.dev/graphql', () => {
    console.log('🔴 MSW: Interceptando requisição HTTP GraphQL');
    return new HttpResponse(
      JSON.stringify({
        errors: [
          {
            message: 'GraphQL Error: Serviço indisponível',
            extensions: { code: 'SERVICE_UNAVAILABLE' },
          },
        ],
        data: null,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),

  // Bloquear completamente o domínio para garantir
  http.all('*v3.identity-platform.dev*', () => {
    console.log('🌐 MSW: Bloqueando requisição para identity-platform');
    return new HttpResponse(JSON.stringify({ error: 'Serviço indisponível' }), { status: 503 });
  }),

  // ----- PARTE 2: HANDLERS HTTP -----
  // Interceptar requisições RSC
  http.get(/\?_rsc=/, async ({ request }) => {
    const url = new URL(request.url);
    console.log(`🔥 MSW: Interceptando requisição RSC: ${url.pathname}`);

    return new HttpResponse(
      JSON.stringify({
        error: 'Erro simulado no RSC',
        path: url.pathname,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-MSW-Error': 'true', // Cabeçalho para identificar respostas MSW
        },
      }
    );
  }),

  // Interceptar requisições Next.js data
  http.get(/\/_next\/data\//, ({ request }) => {
    const url = new URL(request.url);
    console.log(`🔥 MSW: Interceptando Next.js data: ${url.pathname}`);

    return new HttpResponse(
      JSON.stringify({
        pageProps: {
          error: {
            statusCode: 500,
            message: 'Falha ao carregar dados',
            details: 'Erro simulado pelo MSW',
          },
        },
        __N_SSP: true,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-MSW-Error': 'true',
        },
      }
    );
  }),

  // Interceptar especificamente qualquer requisição para v3.identity-platform.dev
  http.all(/v3\.identity-platform\.dev/, ({ request }) => {
    console.log(`🌐 MSW: Interceptando requisição para identity-platform: ${request.url}`);

    return new HttpResponse(
      JSON.stringify({
        error: 'Serviço indisponível',
        code: 'SERVICE_UNAVAILABLE',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),

  // Interceptar APIs específicas
  http.get(/\/api\//, ({ request }) => {
    console.log(`🔥 MSW: Interceptando API: ${request.url}`);

    return new HttpResponse(
      JSON.stringify({
        error: 'API Error',
        path: new URL(request.url).pathname,
      }),
      { status: 500 }
    );
  }),

  // Interceptar requisições POST
  http.post(/\/api\//, async ({ request }) => {
    console.log(`🔥 MSW: Interceptando POST: ${request.url}`);

    // Tentar obter o corpo da requisição
    const body = await request.text().catch(() => '');

    return new HttpResponse(
      JSON.stringify({
        error: 'Falha na operação POST',
        requestSize: body.length,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),

  // Interceptar requisições específicas de operações
  http.all(/\/tenant\/.*\/operations/, ({ request }) => {
    console.log(`🎯 MSW: Interceptando operações: ${request.url}`);

    return new HttpResponse(
      JSON.stringify({
        error: 'Erro ao carregar operações',
        message: 'Serviço temporariamente indisponível',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'X-Error-Code': 'SERVICE_UNAVAILABLE',
        },
      }
    );
  }),
];
