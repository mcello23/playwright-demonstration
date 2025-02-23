import { expect, test } from '@playwright/test';
import { dashboardTexts, operationsTexts } from '../utils/texts/strings.ts';

test.describe('Strings validations of each sub-page, every locale @smoke', () => {
  for (const [locale, data] of Object.entries(dashboardTexts)) {
    test(`As a user, I want to validate all the texts in the ${locale} Dashboard page`, async ({ page }) => {
      await page.goto(`/${locale}`);
      // await page.waitForLoadState('networkidle');

      const assertions = [
        // Upper section
        {
          locator: page.getByRole('checkbox', { name: data.hours }),
          isEnabled: false,
        },
        {
          locator: page.getByRole('checkbox', { name: data.sevenDays }),
          isEnabled: false,
        },
        {
          locator: page.getByRole('checkbox', { name: data.thirtyDays }),
          isEnabled: false,
        },
        {
          locator: page.locator('[data-test="filter-by-date"]'),
          isEnabled: true,
        },

        // Middle section
        { locator: page.getByText(data.newOnboardings), isEnabled: false },
        { locator: page.getByText(data.authentications), isEnabled: false },
        {
          locator: page.getByText(data.onboardings, { exact: true }),
          isEnabled: false,
        },
        { locator: page.getByText(data.successRate), isEnabled: false },
        { locator: page.getByText(data.errorRate), isEnabled: false },
        { locator: page.getByText(data.allOperations), isEnabled: false },

        // Bottom section
        { locator: page.getByText(data.succeeded), isEnabled: false },
        { locator: page.getByText(data.started), isEnabled: false },
        { locator: page.getByText(data.expired), isEnabled: false },
        { locator: page.getByText(data.cancelled), isEnabled: false },
        { locator: page.getByText(data.blocked), isEnabled: false },
        { locator: page.getByText(data.denied), isEnabled: false },
        {
          locator: page.getByText(data.error, { exact: true }),
          isEnabled: false,
        },
      ];

      // Validates all texts are visible and enabled
      for (const assertion of assertions) {
        if (assertion.isEnabled) {
          await expect(assertion.locator).toBeEnabled();
        } else {
          await expect(assertion.locator).toBeVisible();
        }
      }
    });
  }

  for (const [locale, data] of Object.entries(operationsTexts)) {
    test(`As a user, I want to validate all the texts in the ${locale} Operations page`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.locator('[data-test="Operations"]').click();
      // await page.waitForLoadState('networkidle');

      // Static elements
      const assertions = [
        {
          locator: page.locator('[data-test="header"]').getByText(data.title),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.date),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.userID),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.type),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.steps),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.Assets).nth(0),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.status),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.actions),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.sarted).nth(0),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.successful).nth(0),
          isEnabled: false,
        },
        {
          locator: page.getByText(data.rejected).nth(0),
          isEnabled: false,
        },
      ];

      // Validates all texts are visible and enabled
      for (const assertion of assertions) {
        if (assertion.isEnabled) {
          await expect(assertion.locator).toBeEnabled();
        } else {
          await expect(assertion.locator).toBeVisible();
        }
      }
    });
  }
});
