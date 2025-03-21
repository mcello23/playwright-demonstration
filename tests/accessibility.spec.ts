import { description, test } from 'utils/controller/e2e';

test.describe('Accessibility and visual testing in Dashboard page', () => {
  test('Dashboard validation', async ({ browserName, loginPage }) => {
    description('This test verifies the Aria content and compares it to UI screenshots.');
    await loginPage.loadsMainPage();

    await loginPage.seesAriaAttributesDashboard();

    await loginPage.comparesAriaSnapshotScreenshots(browserName);
  });
});

// This is an example that will be built upon
// It still doesn't test UX (focus, keyboard navigation, etc.)
