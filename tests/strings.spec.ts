import { test } from 'utils/controller/e2e';
import { dashboardTexts } from 'utils/strings/dashboard.strings';
import { operationsTexts } from 'utils/strings/operations-row.strings';

test.describe('Strings validations for Dashboard and Operations @smoke', () => {
  for (const locale of Object.keys(dashboardTexts)) {
    test(`Validates all texts in the ${locale} Dashboard page`, async ({ dashboardStrings }) => {
      await dashboardStrings.navigateToDashboard(locale);
      await dashboardStrings.validateDashboardTexts(locale);
    });
  }

  for (const locale of Object.keys(operationsTexts)) {
    test(`Validates all texts in the ${locale} Operations main page`, async ({
      operationsStrings,
    }) => {
      await operationsStrings.navigateToOperations(locale);
      await operationsStrings.validateOperationsTexts(locale);
    });
  }
});
