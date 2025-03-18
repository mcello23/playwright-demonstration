import { expect, test } from '@playwright/test';
import { dashboardTexts, operationsTexts } from '../utils/fixtures/strings';

test.describe('Strings validations for Dashboard and Operations @smoke', () => {
  for (const [locale, data] of Object.entries(dashboardTexts)) {
    test(`Validates all texts in the ${locale} Dashboard page`, async ({ page }) => {
      await test.step('Navigate to Dashboard page in specific locale', async () => {
        await page.goto(`/${locale}`);
        await page.locator('[data-test="header-logo"]').click();
      });

      await test.step('Define text assertions for each Dashboard section', async () => {
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

        await test.step('Validate all dashboard texts are visible and appropriately enabled', async () => {
          for (const assertion of assertions) {
            if (assertion.isEnabled) {
              await expect(assertion.locator).toBeEnabled();
            } else {
              await expect(assertion.locator).toBeVisible();
            }
          }
        });
      });
    });
  }

  for (const [locale, data] of Object.entries(operationsTexts)) {
    test(`Validates all texts in the ${locale} Operations main page`, async ({ page }) => {
      await test.step('Navigate to Operations page in specific locale', async () => {
        await page.goto(`/${locale}`);
        await page.locator('[data-test="Operations"]').click();
        await page.pause();
        await page.locator('[data-test="header"]').focus();
      });

      await test.step('Define text assertions for Operations page elements', async () => {
        // Static elements
        const assertions = [
          {
            locator: page.locator('[data-test="header"]').getByText(data.title),
            isEnabled: false,
          },
          {
            locator: page.getByText(data.startDate),
            isEnabled: false,
          },
          {
            locator: page.getByText(data.endDate),
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

        await test.step('Validate all operations texts are visible and appropriately enabled', async () => {
          for (const assertion of assertions) {
            if (assertion.isEnabled) {
              await expect(assertion.locator).toBeEnabled();
            } else {
              await expect(assertion.locator).toBeVisible();
            }
          }
        });
      });
    });
  }
});
