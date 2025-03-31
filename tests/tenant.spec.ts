import { test } from 'utils/controller/e2e';

const userCredentials = {
  email: process.env.USER_TEST_EMAIL,
  password: process.env.USER_TEST_PASSWORD,
};

test.describe('Happy path: Tenants validation @regression', async () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.loadsURLSkipsTutorial();
  });

  test('Clicks on the Tenant button and sees all elements available @smoke', async ({
    dashboardPage,
  }) => {
    await dashboardPage.clicksTenantButtonAndSeesElements();
  });

  test('Copies a Tenant and sees the toast message in UI', async ({ dashboardPage }) => {
    await dashboardPage.openTenantModal();
    await dashboardPage.copiesTenantAndSeesToast();
  });

  test('Searches a Tenant associated with the user and sees it in the UI', async ({
    dashboardPage,
  }) => {
    await dashboardPage.openTenantModal();
    await dashboardPage.searchesValidTenantAndValidates();
  });

  test('Negative: Searches for a Tenant not associated with the user and sees the not found Aria snapshot in UI', async ({
    dashboardPage,
  }) => {
    await dashboardPage.openTenantModal();
    await dashboardPage.searchesUnvalidTenantAndValidates();
  });

  test('Changes the Tenant of a user and validates through UI @smoke', async ({
    dashboardPage,
  }) => {
    await dashboardPage.openTenantModal();
    await dashboardPage.changesTenantAndValidatesUI();
  });

  test('Access a IDV URL with a different tenant associated to my user and continues to navigate', async ({
    dashboardPage,
    operationPage,
  }) => {
    await dashboardPage.goesToURLWithDifferentTenant();
    await operationPage.operationsHeaderVisible();
  });
});

test.describe('Negative path: Profile and tenants validation @regression', () => {
  test.use({ storageState: 'auth/unsigned.json' });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.loginUnsigned({
      email: userCredentials.email as string,
      password: userCredentials.password as string,
    });
  });
  //TODO: add different loggedin auth state for this test

  test('Access a IDV URL with a tenant not associated to my user and sees the 404 page', async ({
    dashboardPage,
    errorPage,
  }) => {
    await dashboardPage.goesToURLWithDifferentTenant();
    await errorPage.validateErrorPageUI();
  });

  test('Access a IDV URL with a tenant not associated to my user, sees the 404 page and returns to landing', async ({
    dashboardPage,
    errorPage,
    loginPage,
  }) => {
    await dashboardPage.goesToURLWithDifferentTenant();
    await errorPage.validateErrorPageUI();
    await errorPage.clickReturnButtonAndVerifyRedirection(loginPage);
  });
});
