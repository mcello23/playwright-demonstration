import { test } from '../utils/controller/e2e';

test.beforeEach(async ({ page }) => {
  await page.waitForURL(/.*tenant.*/);
});

test.describe('Tests for IDV sub-pages validating URLs, HREF values and Navbar', () => {
  test.describe('Dashboard and Operations pages tests', () => {
    test('Validates Dashboard href values, icon color and URL', async ({
      operationsAndDasbhaord,
      missingString,
    }) => {
      await operationsAndDasbhaord.operationsIconColor();
      await operationsAndDasbhaord.dashboardHREFLink();
      missingString.validateMissingString();
    });

    test('Validates Operations href values and URL', async ({
      operationsAndDasbhaord,
      missingString,
    }) => {
      await operationsAndDasbhaord.operationsHREFLink();
      await operationsAndDasbhaord.clicksNavigationValidatesURL();
      missingString.validateMissingString();
    });
  });

  test.describe('Antifraud and Rules pages tests', () => {
    test.beforeEach(async ({ antifraudAndRules }) => {
      await antifraudAndRules.goesToAntifraud();
    });

    test('Validates Antifraud href values, icon color and URL', async ({
      antifraudAndRules,
      missingString,
    }) => {
      await antifraudAndRules.antifraudIconColor();
      await antifraudAndRules.rejectedHREFLinkProperties();
      missingString.validateMissingString();
    });

    test('Validates Rules href values and URL', async ({ antifraudAndRules, missingString }) => {
      await antifraudAndRules.rulesHREFLink();
      await antifraudAndRules.rulesClickAndRedirection();
      missingString.validateMissingString();
    });
  });

  test.describe('Flows and Integrations pages tests', () => {
    test.beforeEach(async ({ flowsAndIntegrations }) => {
      await flowsAndIntegrations.goesToFlows();
    });

    test('Validates Flows href values, icon color and URL', async ({
      flowsAndIntegrations,
      missingString,
    }) => {
      await flowsAndIntegrations.validateFlowsIconColor();
      await flowsAndIntegrations.validateFlowsLinkProperties();
      missingString.validateMissingString();
    });

    test('Validates Integrations href values and URL', async ({
      flowsAndIntegrations,
      missingString,
    }) => {
      await flowsAndIntegrations.validateIntegrationsLinkProperties();
      await flowsAndIntegrations.navigateToIntegrationsAndVerifyUrl();
      missingString.validateMissingString();
    });
  });

  test.describe('Identities page tests', () => {
    test.beforeEach(async ({ identitiesNavigation, missingString }) => {
      await identitiesNavigation.goesToIdentities();
      missingString.validateMissingString();
    });

    test('Validates Identities href values, icon color and URL', async ({
      identitiesNavigation,
    }) => {
      await identitiesNavigation.validateIdentitiesIconColor();
      await identitiesNavigation.validateIdentitiesListProperties();
    });
  });

  test.describe('User Management page tests', () => {
    test.beforeEach(async ({ userManagementNavigation, missingString }) => {
      await userManagementNavigation.goesToUserManagement();
      missingString.validateMissingString();
    });

    test('Validates User Management href values, icon color and URL', async ({
      userManagementNavigation,
    }) => {
      await userManagementNavigation.validateUserManagementIconColor();
      await userManagementNavigation.validateUsersLinkProperties();
    });
  });
});

test.describe('Negative tests', async () => {
  test('Goes to a wrong URL and validates the 404 page has the correct format', async ({
    errorPage,
    missingString,
  }) => {
    await errorPage.navigateToWrongURL();
    await errorPage.validateErrorPageUI();
    missingString.validateMissingString();
  });

  test('Goes to 404, clicks on the return button and is redirected to home', async ({
    errorPage,
  }) => {
    await errorPage.navigateToWrongURL();
    await errorPage.clickReturnButtonAndVerifyRedirection();
  });
});
