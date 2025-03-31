import { description, test } from 'utils/controller/e2e';

test.describe('Accessibility and visual testing in Dashboard page', () => {
  test('Dashboard Aria snapshot and visual validation', async ({ browserName, dashboardPage }) => {
    description('This test verifies the Aria Snapshot and compares it to UI screenshots.');

    await dashboardPage.loadsURLSkipsTutorial();

    await dashboardPage.seesAriaAttributesDashboard();

    await dashboardPage.comparesAriaSnapshotScreenshots(browserName);
  });
});

// This is an example that will be built upon
// It still doesn't test UX (focus, keyboard navigation, etc.)
