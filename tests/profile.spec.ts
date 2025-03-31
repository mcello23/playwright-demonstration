import { test } from 'utils/controller/e2e';

test.beforeEach(async ({ dashboardPage }) => {
  await dashboardPage.loadsURLSkipsTutorial();
});
test.describe('Profile options and tutorial modal validation @regression', async () => {
  test('Validates logout button when clicking on header "Profile" @smoke', async ({
    dashboardPage,
  }) => {
    await dashboardPage.seesProfileOptions();
  });

  test('Validates "Welcome" modal tutorial @smoke', async ({ dashboardPage }) => {
    await dashboardPage.clicksAndValidatesTutorial();
  });
});

test.describe('User Management validation', () => {
  test.beforeEach(async ({ userManagementNavigation, userManagementPage }) => {
    await userManagementNavigation.goesToUserManagement();
    await userManagementPage.clicksOnUser();
  });

  test('Validates User Management page elements are visible in the UI @smoke', async ({
    userManagementPage,
  }) => {
    await userManagementPage.validatesUserManagementAriaSnapshot();
  });

  test('Edits a User and validates all inputs and dropdown menus @smoke', async ({
    userManagementPage,
  }) => {
    await userManagementPage.clicksOnEditButton();
    await userManagementPage.validatesAllInputsAndDropdown();
  });

  test('Edits profile', async ({ userManagementPage }) => {
    await userManagementPage.clicksOnEditButton();
    await userManagementPage.editsProfile();
  });
});
