import { test } from 'utils/controller/e2e';

test.describe('Profile and header options validation tests @regression', async () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.loadsURLSkipsTutorial();
  });

  test('Validates logout button when clicking on header "Profile" @smoke', async ({
    dashboardPage,
  }) => {
    await dashboardPage.seesProfileOptions();
  });

  test('Validates "Welcome" modal tutorial @smoke', async ({ dashboardPage }) => {
    await dashboardPage.clicksAndValidatesTutorial();
  });

  test('Validates User Management page elements @smoke', async ({
    userManagementNavigation,
    userManagementPage,
  }) => {
    await userManagementNavigation.goesToUserManagement();
    await userManagementPage.clicksOnUser();
  });
});
