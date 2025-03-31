import { navigationTestsConfig, test } from 'utils/controller/e2e';

test.describe('Happy Path: Navigates to all IDV pages, validating URLs, HREF values and navbar', () => {
  navigationTestsConfig.forEach((navTest) => {
    test.describe(`${navTest.name} page`, () => {
      test.beforeEach(
        async ({
          dashboardPage,
          operationsAndDasbhaord,
          antifraudAndRules,
          flowsAndIntegrations,
          identitiesNavigation,
          userManagementNavigation,
        }) => {
          await dashboardPage.loadsURLSkipsTutorial();

          const fixtureMap = {
            operationsAndDasbhaord,
            antifraudAndRules,
            flowsAndIntegrations,
            identitiesNavigation,
            userManagementNavigation,
          };

          const fixture = fixtureMap[navTest.fixtureKey];

          if (navTest.setup) {
            await navTest.setup(fixture);
          }
        }
      );

      test(`Validates ${navTest.name} elements`, async ({
        operationsAndDasbhaord,
        antifraudAndRules,
        flowsAndIntegrations,
        identitiesNavigation,
        userManagementNavigation,
        missingString,
      }) => {
        const fixtureMap = {
          operationsAndDasbhaord,
          antifraudAndRules,
          flowsAndIntegrations,
          identitiesNavigation,
          userManagementNavigation,
        };

        const fixture = fixtureMap[navTest.fixtureKey];

        await navTest.validate(fixture, missingString);
      });
    });
  });
});

test.describe('Negative tests', () => {
  test('Goes to a wrong URL and validates the 404 page', async ({ errorPage, missingString }) => {
    await errorPage.navigateToWrongURL();
    await errorPage.validatesOldErrorPage();
    await missingString.validateMissingString();
  });

  test('Clicks return button on 404 page and is redirected to home', async ({
    errorPage,
    dashboardPage,
  }) => {
    await errorPage.navigateToWrongURL();
    await errorPage.validatesOldErrorPage();
    await errorPage.clicksOnErrorButtonSeesLanding(dashboardPage);
  });
});
