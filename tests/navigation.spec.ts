import { expect, test } from '../utils/fixtures/e2e';

test.describe('Tests for IDV sub-pages validating URLs, HREF values and Navbar', () => {
  test.describe('Dashboard and Operations pages tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.waitForLoadState('networkidle');
      await page.locator('[data-test="header-logo"]').isEnabled();
      await page.locator('[data-test="header-logo"]').isVisible();
    });

    test('Validates Dashboard href values, icon color and URL', async ({ page }) => {
      await expect(page).not.toHaveURL(/.*dashboard.*/);

      const operationsDiv = page.locator('div').filter({ hasText: 'Operations' });
      const iconWrapper = operationsDiv.locator(
        '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-yellow400)"]'
      );
      await expect(iconWrapper).toBeVisible();

      const dashboardLocator = page.locator('[data-test="Dashboard"] > a');
      await dashboardLocator.isVisible();
      await dashboardLocator.isEnabled();

      const hrefValueDash = await dashboardLocator.getAttribute('href');
      const expectedHrefDash = '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3';
      expect(hrefValueDash).toBe(expectedHrefDash);
    });

    test('Validates Operations href values and URL', async ({ page }) => {
      const operationsLocator = page.locator('[data-test="Operations"] > a');
      await operationsLocator.isVisible();
      await operationsLocator.isEnabled();

      const hrefValueOperations = await operationsLocator.getAttribute('href');
      const expectedHrefOperations = '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3/operations';
      expect(hrefValueOperations).toBe(expectedHrefOperations);

      await page.locator('[data-test="Operations"]').click();
      await page.waitForURL('**/operations');
    });
  });

  test.describe('Antifraud and Rules pages tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'Antifraud' }).click();
    });

    test('Validates Antifraud href values, icon color and URL', async ({ page }) => {
      await page.waitForURL('**/antifraud');
      await page.locator('[data-test="header"]').getByText('Antifraud').isVisible();

      const antifraudDiv = page.locator('div').filter({ hasText: 'Antifraud' });
      const iconWrapper = antifraudDiv.locator(
        '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-tomato400)"]'
      );
      await expect(iconWrapper).toBeVisible();

      const rejectedLocator = page.locator('[data-test="RejectedList"] > a');
      await rejectedLocator.isVisible();
      await rejectedLocator.isEnabled();

      const rejectedHref = await rejectedLocator.getAttribute('href');
      const expectedRejectedHref = '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3/antifraud';
      expect(rejectedHref).toBe(expectedRejectedHref);
    });

    test('Validates Rules href values and URL', async ({ page }) => {
      const rulesLocator = page.locator('[data-test="Rules"] > a');
      await rulesLocator.isVisible();
      await rulesLocator.isEnabled();

      const rulesHref = await rulesLocator.getAttribute('href');
      const expectedRulesdHref = '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3/antifraud/rules';
      expect(rulesHref).toBe(expectedRulesdHref);

      await page.locator('[data-test="Rules"]').click();
      await page.waitForURL('**/antifraud/rules');
    });
  });

  test.describe('Flows and Integrations pages tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'Flows' }).click();
    });

    test('Validates Flows href values, icon color and URL', async ({ page }) => {
      await page.waitForURL('**/flows');
      await page.locator('[data-test="header"]').getByText('Flows').isVisible();

      const flowsDiv = page.locator('div', { hasText: 'Flows' });
      const iconWrapper = flowsDiv.locator(
        '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-pink400)"]'
      );
      await expect(iconWrapper).toBeVisible();
      const flowsLocator = page.locator('[data-test="Flows"] > a');
      await flowsLocator.isVisible();
      await flowsLocator.isEnabled();

      const flowsHref = await flowsLocator.getAttribute('href');
      const expectedFlowsHref = '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3/flows';
      expect(flowsHref).toBe(expectedFlowsHref);
    });

    test('Validates Integrations href values and URL', async ({ page }) => {
      const integrationsLocator = page.locator('[data-test="Integrations"] > a');
      await integrationsLocator.isVisible();
      await integrationsLocator.isEnabled();

      const integrationsHref = await integrationsLocator.getAttribute('href');
      const expectedIntegrationsHref =
        '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3/integrations';
      expect(integrationsHref).toBe(expectedIntegrationsHref);

      await page.locator('[data-test="Integrations"]').click();
      await page.waitForURL('**/integrations');
    });
  });
  test.describe('Identities page tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'Identities' }).click();
    });

    test('Validates Identities href values, icon color and URL', async ({ page }) => {
      await page.waitForURL('**/identities');
      await page.locator('[data-test="header"]').getByText('Identities').isVisible();

      const identitiesDiv = page.locator('div', { hasText: 'Identities' });
      const iconWrapper = identitiesDiv.locator(
        '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-blue400)"]'
      );
      await expect(iconWrapper).toBeVisible();
      const identitiesLocator = page.locator('[data-test="Identities"] > a');
      await identitiesLocator.isVisible();
      await identitiesLocator.isEnabled();

      const identitiesHref = await identitiesLocator.getAttribute('href');
      const expectedIDHref = '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3/identities';
      expect(identitiesHref).toBe(expectedIDHref);
    });
  });
  test.describe('User Management page tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Application' }).click();
      await page.waitForSelector('.facephi-ui-portal__container');
      await page.getByRole('listitem').filter({ hasText: 'User Management' }).click();
    });

    test('Validates User Management href values, icon color and URL', async ({ page }) => {
      await page.waitForURL('**/user-management');
      await page.locator('[data-test="header"]').getByText('User management').isVisible();

      const identitiesDiv = page.locator('div', { hasText: 'User management' });
      const iconWrapper = identitiesDiv.locator(
        '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-orange400)"]'
      );
      await expect(iconWrapper).toBeVisible();
      const identitiesLocator = page.locator('[data-test="Users"] > a');
      await identitiesLocator.isVisible();
      await identitiesLocator.isEnabled();

      const identitiesHref = await identitiesLocator.getAttribute('href');
      const expectedIDHref = '/en/tenant/8d04089d-8273-442e-ad40-2bf10ff494b3/user-management';
      expect(identitiesHref).toBe(expectedIDHref);
    });
  });
});

test.describe('Negative tests', async () => {
  test('Goes to a wrong URL and validates the 404 page has the correct format', async ({
    page,
  }) => {
    await page.waitForSelector('[data-test="header"]');
    await page.goto(`${process.env.BASE_URL}/wrong-url`);

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

  test('Goes to 404, clicks on the return button and is redirected to home', async ({ page }) => {
    await page.waitForSelector('[data-test="header"]');
    await page.goto(`${process.env.BASE_URL}/wrong-url`);
    const errorImage = page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();

    await page.locator('[data-test="error-button"]').click();
    await page.waitForURL(/.*tenant.*/);
    const homeLocator = page.locator('[data-test="header"]').getByText('Dashboard');
    await expect(homeLocator).toBeVisible();
  });
});
