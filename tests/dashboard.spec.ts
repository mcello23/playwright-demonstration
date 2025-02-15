import { faker } from '@faker-js/faker';
import { expect, test } from '../utils/test-extend';
import { dashboardTexts } from '../utils/texts/dashboard.texts';

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

test.describe('Dashboard validation flows @regression', () => {
  for (const [locale, data] of Object.entries(dashboardTexts)) {
    test(`As a user, I want to see all elements present in the dashboard in ${locale}`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      await page.waitForLoadState('networkidle');

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

      // Valida todos los elementos
      for (const assertion of assertions) {
        if (assertion.isEnabled) {
          await expect(assertion.locator).toBeEnabled();
        } else {
          await expect(assertion.locator).toBeVisible();
        }
      }
    });
  }

  test('As a user, I want to insert random dates in the dashboard filter and validate via UI @regression', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const daysInPast = faker.number.int({ min: 1, max: 365 });
    const startDate = new Date(
      new Date().setDate(new Date().getDate() - daysInPast),
    );
    const daysInFuture = faker.number.int({ min: 1, max: 365 });
    const endDate = new Date(
      new Date().setDate(new Date().getDate() + daysInFuture),
    );
    const formattedDateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDateRange);

    await expect(filterByDateLocator).toHaveValue(formattedDateRange);
  });
});

//TODO: Add more tests
// Buttons tests
// Create spec for Operations and validate Buttons and elements
