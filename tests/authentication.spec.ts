import { description, test } from 'utils/controller/e2e';

test.describe('Happy Path: Authenticates correctly to IDV and validates Login and Logout @regression', async () => {
  test.use({ storageState: 'auth/unsigned.json' });

  test('Logs in successfully and validates OIDC token authentication and params and validates landing page in UI @smoke', async ({
    apiHelpers,
    dashboardPage,
    loginPage,
  }) => {
    description(
      'Validation of Login flow, using an Unsigned state, intercepting OpenID token and validating UI elements in landing page.'
    );

    const tokenDataPromise = apiHelpers.validatesOIDCTokenAndParams();

    await loginPage.loginUnsigned();

    const tokenData = await tokenDataPromise;
    console.log('✅ OIDC token and params intercepted:', tokenData);

    await dashboardPage.seesFilterDate();
  });
  test('Logs out successfully and validates OIDC redirection code and sees login page at UI @smoke', async ({
    apiHelpers,
    dashboardPage,
    loginPage,
  }) => {
    description('Validation of Logout flow, intercepting OpenID response and sees login page.');

    await loginPage.loginUnsigned();

    const logoutDataPromise = apiHelpers.validatesOIDCRedirect();
    await dashboardPage.clicksLogout();

    const logoutData = await logoutDataPromise;
    console.log('✅ OIDC logout redirection intercepted:', logoutData);

    await loginPage.seesLoginPage();
  });
});
