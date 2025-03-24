import { description, test } from '../utils/controller/e2e';

test.describe('Happy Path: Authenticates correctly to IDV and validates Login and Logout @regression', async () => {
  test.use({ storageState: 'auth/unsigned.json' });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.loginUnsigned();
  });

  test('Logs in successfully and validates OIDC token authentication and params and validates landing page in UI @smoke', async ({
    apiHelpers,
    dashboardPage,
  }) => {
    description(
      'Validation of Login flow, using an Unsigned state, intercepting OpenID token and validating UI elements in landing page.'
    );

    await apiHelpers.validatesOIDCTokenAndParams();
    console.log('✅ OIDC token and params intercepted');

    await dashboardPage.seesFilterDate();
  });

  test('Logs out successfully and validates OIDC redirection code and sees login page at UI @smoke', async ({
    apiHelpers,
    dashboardPage,
    loginPage,
  }) => {
    description('Validation of Logout flow, intercepting OpenID response and sees login page.');

    await dashboardPage.clicksLogout();
    await apiHelpers.validatesOIDCRedirect();
    console.log("✅ OIDC '303' redirection intercepted");
    await loginPage.seesLoginPage();
  });
});
