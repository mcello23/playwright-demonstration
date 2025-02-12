import { expect, test } from '../utils/test-extend';

const loginAndValidateAPI = async (page: any, locale: string) => {
  // const getAggregateStatisticsPromise = page.waitForResponse(
  //   '**/graphql',
  //   async (response: any) => {
  //     const request = response.request();
  //     const postData = JSON.parse(request.postData()!);

  //     if (postData.operationName === 'getAggregateStatistics') {
  //       expect(postData).toHaveProperty(
  //         'operationName',
  //         'getAggregateStatistics',
  //       );
  //     }
  //     return false;
  //   },
  // );
  await page.goto(`/${locale}`);
  // const response = await getAggregateStatisticsPromise;
  // expect(response.status()).toBe(200);
};

const dashboardTexts = {
  en: {
    hours: '24 hours',
    sevenDays: '7 days',
    thirtyDays: '30 days',
    newOnboardings: 'New onboardings',
    authentications: 'Authentications',
    onboardings: 'Onboardings',
    successRate: 'Success rate',
    errorRate: 'Error rate',
    allOperations: 'All operations (%)',
    succeeded: 'Succeeded',
    started: 'Started',
    expired: 'Expired',
    cancelled: 'Cancelled',
    blocked: 'Blocked',
    denied: 'Denied',
    error: 'Error',
  },
  es: {
    hours: '24 horas',
    sevenDays: '7 días',
    thirtyDays: '30 días',
    newOnboardings: 'Nuevos registros',
    authentications: 'Autenticaciones',
    onboardings: 'Onboardings',
    successRate: 'Tasa de éxito',
    errorRate: 'Tasa de errores',
    allOperations: 'Todas las operaciones (%)',
    succeeded: 'Exitoso',
    started: 'Iniciado',
    expired: 'Expirado',
    cancelled: 'Cancelado',
    blocked: 'Bloqueado',
    denied: 'Denegado',
    error: 'Error',
  },
  pt: {
    hours: '24 horas',
    sevenDays: '7 dias',
    thirtyDays: '30 dias',
    newOnboardings: 'Novos registros',
    authentications: 'Autenticações',
    onboardings: 'Onboardings',
    successRate: 'Taxa de sucesso',
    errorRate: 'Taxa de erro',
    allOperations: 'Todas as operações (%)',
    succeeded: 'Bem-sucedido',
    started: 'Iniciado',
    expired: 'Expirado',
    cancelled: 'Cancelado',
    blocked: 'Bloqueado',
    denied: 'Negado',
    error: 'Erro',
  },
};

test.describe('Dashboard validation flows @regression', () => {
  const locales: Array<'en' | 'es' | 'pt'> = ['en', 'es', 'pt'];

  locales.forEach((locale) => {
    test(`As a user, I want to see all elements present in the dashboard in ${locale}`, async ({
      page,
    }) => {
      await loginAndValidateAPI(page, locale);

      const texts = dashboardTexts[locale];

      // Upper section
      await expect(
        page.getByRole('checkbox', { name: texts.hours }),
      ).toBeVisible();
      await expect(
        page.getByRole('checkbox', { name: texts.sevenDays }),
      ).toBeVisible();
      await expect(
        page.getByRole('checkbox', { name: texts.thirtyDays }),
      ).toBeVisible();
      await expect(page.locator('[data-test="filter-by-date"]')).toBeEnabled();

      // Middle section
      await expect(page.getByText(texts.newOnboardings)).toBeVisible();
      await expect(page.getByText(texts.authentications)).toBeVisible();
      await expect(
        page.getByText(texts.onboardings, { exact: true }),
      ).toBeVisible();
      await expect(page.getByText(texts.successRate)).toBeVisible();
      await expect(page.getByText(texts.errorRate)).toBeVisible();
      await expect(page.getByText(texts.allOperations)).toBeVisible();

      // Bottom section
      await expect(page.getByText(texts.succeeded)).toBeVisible();
      await expect(page.getByText(texts.started)).toBeVisible();
      await expect(page.getByText(texts.expired)).toBeVisible();
      await expect(page.getByText(texts.cancelled)).toBeVisible();
      await expect(page.getByText(texts.blocked)).toBeVisible();
      await expect(page.getByText(texts.denied)).toBeVisible();
      await expect(page.getByText(texts.error, { exact: true })).toBeVisible();
    });
  });
});
