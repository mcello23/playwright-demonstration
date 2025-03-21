import { test } from '../utils/controller/e2e';

test.beforeEach(async ({ page }) => {
  await page.waitForURL(/.*tenant.*/, { waitUntil: 'domcontentloaded' });
});

test.describe('Tests for IDV sub-pages validating URLs, HREF values and Navbar', () => {
  test.describe('Dashboard and Operations pages tests', () => {
    test('Validates Dashboard href values, icon color and URL', async ({
      operationsAndDasbhaord,
      MissingString,
    }) => {
      operationsAndDasbhaord.operationsIconColor();
      operationsAndDasbhaord.dashboardHREFLink();
      MissingString.validateMissingString();
    });

    test('Validates Operations href values and URL', async ({
      operationsAndDasbhaord,
      MissingString,
    }) => {
      operationsAndDasbhaord.operationsHREFLink();
      await operationsAndDasbhaord.clicksNavigationValidatesURL();
      MissingString.validateMissingString();
    });
  });

  test.describe('Antifraud and Rules pages tests', () => {
    test.beforeEach(async ({ antifraudAndRules }) => {
      await antifraudAndRules.goesToAntifraud();
    });

    test('Validates Antifraud href values, icon color and URL', async ({
      antifraudAndRules,
      MissingString,
    }) => {
      antifraudAndRules.antifraudIconColor();
      antifraudAndRules.rejectedHREFLinkProperties();
      MissingString.validateMissingString();
    });

    test('Validates Rules href values and URL', async ({ antifraudAndRules, MissingString }) => {
      antifraudAndRules.rulesHREFLink();
      await antifraudAndRules.rulesClickAndRedirection();
      MissingString.validateMissingString();
    });
  });

  test.describe('Flows and Integrations pages tests', () => {
    test.beforeEach(async ({ flowsAndIntegrations }) => {
      await flowsAndIntegrations.goesToFlows();
    });

    test('Validates Flows href values, icon color and URL', async ({
      flowsAndIntegrations,
      MissingString,
    }) => {
      flowsAndIntegrations.validateFlowsIconColor();
      flowsAndIntegrations.validateFlowsLinkProperties();
      MissingString.validateMissingString();
    });

    test('Validates Integrations href values and URL', async ({
      flowsAndIntegrations,
      MissingString,
    }) => {
      flowsAndIntegrations.validateIntegrationsLinkProperties();
      await flowsAndIntegrations.navigateToIntegrationsAndVerifyUrl();
      MissingString.validateMissingString();
    });
  });

  test.describe('Identities page tests', () => {
    test.beforeEach(async ({ identitiesNavigation, MissingString }) => {
      await identitiesNavigation.goesToIdentities();
      MissingString.validateMissingString();
    });

    test('Validates Identities href values, icon color and URL', async ({
      identitiesNavigation,
    }) => {
      identitiesNavigation.validateIdentitiesIconColor();
      identitiesNavigation.validateIdentitiesListProperties();
    });
  });

  test.describe('User Management page tests', () => {
    test.beforeEach(async ({ userManagementNavigation, MissingString }) => {
      await userManagementNavigation.goesToUserManagement();
      MissingString.validateMissingString();
    });

    test('Validates User Management href values, icon color and URL', async ({
      userManagementNavigation,
    }) => {
      userManagementNavigation.validateUserManagementIconColor();
      userManagementNavigation.validateUsersLinkProperties();
    });
  });
});

test.describe('Negative tests', async () => {
  test('Goes to a wrong URL and validates the 404 page has the correct format', async ({
    errorPageNavigation,
    MissingString,
  }) => {
    await errorPageNavigation.navigateToWrongURL();
    await errorPageNavigation.validateErrorPageUI();
    MissingString.validateMissingString();
  });

  test('Goes to 404, clicks on the return button and is redirected to home', async ({
    errorPageNavigation,
  }) => {
    errorPageNavigation.navigateToWrongURL();
    await errorPageNavigation.clickReturnButtonAndVerifyRedirection();
  });
});
