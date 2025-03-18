import { expect, test } from '../utils/fixtures/e2e';

test.beforeEach(async ({ page }) => {
  page.on('console', (msg) => {
    if (msg.text().includes('MISSING TRANSLATION')) {
      console.log(`Missing translation found: ${msg.text()}`);
    }
  });
});

test.describe('Tests for IDV sub-pages validating URLs, HREF values and Navbar', () => {
  test.describe('Dashboard and Operations pages tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-test="header-logo"]').isEnabled();
      await page.locator('[data-test="header-logo"]').isVisible();
    });

    test('Validates Dashboard href values, icon color and URL', async ({ page }) => {
      await test.step('Verify initial page URL is not dashboard', async () => {
        await expect(page).not.toHaveURL(/.*dashboard.*/);
      });

      await test.step('Validate Operations icon color', async () => {
        const operationsDiv = page.locator('div').filter({ hasText: 'Operations' });
        const iconWrapper = operationsDiv.locator(
          '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-yellow400)"]'
        );
        await expect(iconWrapper).toBeVisible();
      });

      await test.step('Validate Dashboard link properties', async () => {
        const dashboardLocator = page.locator('[data-test="Dashboard"] > a');
        await dashboardLocator.isVisible();
        await dashboardLocator.isEnabled();

        const hrefValueDash = await dashboardLocator.getAttribute('href');
        const expectedHrefDash = '/en/tenant/idv-demo';
        expect(hrefValueDash).toBe(expectedHrefDash);
      });
    });

    test('Validates Operations href values and URL', async ({ page }) => {
      await test.step('Validate Operations link properties', async () => {
        const operationsLocator = page.locator('[data-test="Operations"] > a');
        await operationsLocator.isVisible();
        await operationsLocator.isEnabled();

        const hrefValueOperations = await operationsLocator.getAttribute('href');
        const expectedHrefOperations = '/en/tenant/idv-demo/operations';
        expect(hrefValueOperations).toBe(expectedHrefOperations);
      });

      await test.step('Navigate to Operations page and verify URL', async () => {
        await page.locator('[data-test="Operations"]').click();
        await page.waitForURL('**/operations');
      });
    });
  });

  test.describe('Antifraud and Rules pages tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'Antifraud' }).click();
    });

    test('Validates Antifraud href values, icon color and URL', async ({ page }) => {
      await test.step('Verify navigation to Antifraud page', async () => {
        await page.waitForURL('**/antifraud');
        await expect(page.locator('[data-test="header"]').getByText('Antifraud')).toBeVisible();
      });

      await test.step('Validate Antifraud icon color', async () => {
        const iconWrapper = page.locator(
          'div.facephi-ui-icon-wrapper[style*="background-color: var(--colors-tomato400)"]'
        );
        await expect(iconWrapper).toBeVisible();
      });

      await test.step('Validate Rejected List link properties', async () => {
        const rejectedLocator = page.locator('[data-test="RejectedList"] > a');
        await rejectedLocator.isVisible();
        await rejectedLocator.isEnabled();

        const rejectedHref = await rejectedLocator.getAttribute('href');
        const expectedRejectedHref = '/en/tenant/idv-demo/antifraud';
        expect(rejectedHref).toBe(expectedRejectedHref);
      });
    });

    test('Validates Rules href values and URL', async ({ page }) => {
      await test.step('Validate Rules link properties', async () => {
        const rulesLocator = page.locator('[data-test="Rules"] > a');
        await rulesLocator.isVisible();
        await rulesLocator.isEnabled();

        const rulesHref = await rulesLocator.getAttribute('href');
        const expectedRulesdHref = '/en/tenant/idv-demo/antifraud/rules';
        expect(rulesHref).toBe(expectedRulesdHref);
      });

      await test.step('Navigate to Rules page and verify URL', async () => {
        await page.locator('[data-test="Rules"]').click();
        await page.waitForURL('**/antifraud/rules');
      });
    });
  });

  test.describe('Flows and Integrations pages tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'Flows' }).click();
    });

    test('Validates Flows href values, icon color and URL', async ({ page }) => {
      await test.step('Verify navigation to Flows page', async () => {
        await page.waitForURL('**/flows');
        await page.locator('[data-test="header"]').getByText('Flows').isVisible();
      });

      await test.step('Validate Flows icon color', async () => {
        const flowsDiv = page.locator('div', { hasText: 'Flows' });
        const iconWrapper = flowsDiv.locator(
          '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-pink400)"]'
        );
        await expect(iconWrapper).toBeVisible();
      });

      await test.step('Validate Flows link properties', async () => {
        const flowsLocator = page.locator('[data-test="Flows"] > a');
        await flowsLocator.isVisible();
        await flowsLocator.isEnabled();

        const flowsHref = await flowsLocator.getAttribute('href');
        const expectedFlowsHref = '/en/tenant/idv-demo/flows';
        expect(flowsHref).toBe(expectedFlowsHref);
      });
    });

    test('Validates Integrations href values and URL', async ({ page }) => {
      await test.step('Validate Integrations link properties', async () => {
        const integrationsLocator = page.locator('[data-test="Integrations"] > a');
        await integrationsLocator.isVisible();
        await integrationsLocator.isEnabled();

        const integrationsHref = await integrationsLocator.getAttribute('href');
        const expectedIntegrationsHref = '/en/tenant/idv-demo/integrations';
        expect(integrationsHref).toBe(expectedIntegrationsHref);
      });

      await test.step('Navigate to Integrations page and verify URL', async () => {
        await page.locator('[data-test="Integrations"]').click();
        await page.waitForURL('**/integrations');
      });
    });
  });

  test.describe('Identities page tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'Identities' }).click();
    });

    test('Validates Identities href values, icon color and URL', async ({ page }) => {
      await test.step('Verify navigation to Identities page', async () => {
        await page.waitForURL('**/identities');
        await page.locator('[data-test="header"]').getByText('Identities').isVisible();
      });

      await test.step('Validate Identities icon color', async () => {
        const identitiesDiv = page.locator('div', { hasText: 'Identities' });
        const iconWrapper = identitiesDiv.locator(
          '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-blue400)"]'
        );
        await expect(iconWrapper).toBeVisible();
      });

      await test.step('Validate Identities List link properties', async () => {
        const identitiesLocator = page.locator('[data-test="List"] > a');
        await identitiesLocator.isVisible();
        await identitiesLocator.isEnabled();

        const identitiesHref = await identitiesLocator.getAttribute('href');
        const expectedIDHref = '/en/tenant/idv-demo/identities';
        expect(identitiesHref).toBe(expectedIDHref);
      });
    });
  });

  test.describe('User Management page tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'User Management' }).click();
    });

    test('Validates User Management href values, icon color and URL', async ({ page }) => {
      await test.step('Verify navigation to User Management page', async () => {
        await page.waitForURL('**/user-management');
        await page.locator('[data-test="header"]').getByText('User management').isVisible();
      });

      await test.step('Validate User Management icon color', async () => {
        const identitiesDiv = page.locator('div', { hasText: 'User management' });
        const iconWrapper = identitiesDiv.locator(
          '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-orange400)"]'
        );
        await expect(iconWrapper).toBeVisible();
      });

      await test.step('Validate Users link properties', async () => {
        const identitiesLocator = page.locator('[data-test="Users"] > a');
        await identitiesLocator.isVisible();
        await identitiesLocator.isEnabled();

        const identitiesHref = await identitiesLocator.getAttribute('href');
        const expectedIDHref = '/en/tenant/idv-demo/user-management';
        expect(identitiesHref).toBe(expectedIDHref);
      });
    });
  });
});

test.describe('Negative tests', async () => {
  test('Goes to a wrong URL and validates the 404 page has the correct format', async ({
    page,
  }) => {
    await test.step('Navigate to the application and then to an incorrect URL', async () => {
      await page.waitForSelector('[data-test="header"]');
      await page.goto('/wrong-url');
    });

    await test.step('Validate error page UI elements', async () => {
      const topLogo = page.getByRole('img').first();
      await expect(topLogo).toBeVisible();

      const errorImage = page.getByRole('img', { name: 'Error image' });
      await expect(errorImage).toBeVisible();

      const firstErrorText = page.getByText('Houstoooon, something went wrong!');
      await expect(firstErrorText).toBeVisible();

      const secondErrorText = page.getByText('Click below to land in IDV Suite');
      await expect(secondErrorText).toBeVisible();

      const homeButton = page.locator('[data-test="error-button"]').getByText('Land here');
      await expect(homeButton).toBeVisible();
      await expect(homeButton).toBeEnabled();
    });
  });

  test('Goes to 404, clicks on the return button and is redirected to home', async ({ page }) => {
    await test.step('Navigate to the application and then to an incorrect URL', async () => {
      await page.waitForSelector('[data-test="header"]');
      await page.goto('/wrong-url');
    });

    await test.step('Verify error page appears', async () => {
      const errorImage = page.getByRole('img', { name: 'Error image' });
      await expect(errorImage).toBeVisible();
    });

    await test.step('Click return button and verify redirection to home page', async () => {
      await page.locator('[data-test="error-button"]').click();
      await page.waitForURL(/.*tenant.*/);
      const homeLocator = page.locator('[data-test="header"]').getByText('Dashboard');
      await expect(homeLocator).toBeVisible();
    });
  });
});
