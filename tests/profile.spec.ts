import { test } from 'utils/controller/e2e';

const imageFormats = [
  { format: 'jpg', path: 'tests/avatar-tests/formats/format_jpg.jpg' },
  { format: 'png', path: 'tests/avatar-tests/formats/format_png.png' },
  { format: 'jpeg', path: 'tests/avatar-tests/formats/format_jpeg.jpeg' },
];

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
    await userManagementPage.clicksOnTestUser();
  });

  test('Validates User Management page elements are visible in the UI @smoke', async ({
    userManagementPage,
  }) => {
    await userManagementPage.validatesUserManagementAriaSnapshot();
  });

  test.describe('Editing Profile tests', () => {
    test.beforeEach(async ({ userManagementPage }) => {
      await userManagementPage.clicksOnEditButton();
    });
    test('Enters a User profile and validates that all inputs and dropdown menus follow requirements @smoke', async ({
      userManagementPage,
    }) => {
      await userManagementPage.validatesAllInputsAndDropdown();
    });

    test('Updates user names with random inputs and validates it in the UI', async ({
      userManagementPage,
    }) => {
      await userManagementPage.editsProfile();
    });

    for (const { format, path } of imageFormats) {
      test(`Edits the user avatar with ${format.toUpperCase()} format and validates in UI and intercepts request`, async ({
        userManagementPage,
      }) => {
        await userManagementPage.updatesImageProfile(format, path);
      });
    }
    test('Clicks on recover password and validates success toast message in the UI', async ({
      userManagementPage,
    }) => {
      await userManagementPage.clicksOnRecoverPassword();
      await userManagementPage.validatesSuccessToastMessage();
    });
  });
});
