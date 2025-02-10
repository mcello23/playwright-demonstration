/* eslint-disable */
import { expect, test } from '@playwright/test';

const menuItems = {
  es: {
    lang: 'es',
    texts: [
      'Apertura de cuenta',
      'Verificación de domicilio',
      'Verificación de edad',
      'Autenticación',
      'Verificación de identidad',
      'Autenticación de usuario',
    ],
  },
  en: {
    lang: 'en',
    texts: [
      'Account opening',
      'Address verification',
      'Age verification',
      'Authentication',
      'Identity verification',
      'User authentication',
    ],
  },
  pt: {
    lang: 'pt',
    texts: [
      'Abertura de conta',
      'Verificação de endereço',
      'Verificação de idade',
      'Autenticação',
      'Verificação de identidade',
      'Autenticação de usuário',
    ],
  },
};

const expectedNavLinks = {
  pt: {
    lang: 'pt',
    texts: [
      { dataTest: 'dashboard', href: '/pt', text: 'Dashboard' },
      { dataTest: 'flows', href: '/pt/flows', text: 'Fluxos' },
      { dataTest: 'operations', href: '/pt/operations', text: 'Operações' },
      { dataTest: 'identities', href: '/pt/identities', text: 'Identidades' },
      {
        dataTest: 'integrations',
        href: '/pt/integrations',
        text: 'Integrações',
      },
    ],
  },
  en: {
    lang: 'en',
    texts: [
      { dataTest: 'dashboard', href: '/en', text: 'Dashboard' },
      { dataTest: 'flows', href: '/en/flows', text: 'Flows' },
      { dataTest: 'operations', href: '/en/operations', text: 'Operations' },
      { dataTest: 'identities', href: '/en/identities', text: 'Identities' },
      {
        dataTest: 'integrations',
        href: '/en/integrations',
        text: 'Integrations',
      },
    ],
  },
  es: {
    lang: 'es',
    texts: [
      { dataTest: 'dashboard', href: '/es', text: 'Dashboard' },
      { dataTest: 'flows', href: '/es/flows', text: 'Flujos' },
      { dataTest: 'operations', href: '/es/operations', text: 'Operaciones' },
      { dataTest: 'identities', href: '/es/identities', text: 'Identidades' },
      {
        dataTest: 'integrations',
        href: '/es/integrations',
        text: 'Integraciones',
      },
    ],
  },
};

test.describe('Login @login', () => {
  test('should be logged in @smoke', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveURL('/en');
    await expect(page).toHaveTitle(/IDV Suite/);
  });

  test('should validate elements in dashboard (hardcoded) @regression', async ({
    page,
  }) => {
    await page.goto('/es');
    await expect(page).toHaveTitle(/IDV Suite/);
    await page.waitForLoadState('networkidle');
    await page.locator('data-test=input-right-icon').click({ force: true });
    const expectedTexts = [
      'Apertura de cuenta',
      'Verificación de domicilio',
      'Verificación de edad',
      'Autenticación',
      'Verificación de identidad',
      'Autenticación de usuario',
    ];
    const menuItems = page.getByRole('menuitem');
    const actualTexts = await menuItems.allTextContents();

    expect(actualTexts).toEqual(expectedTexts);
  });

  for (const [lang, data] of Object.entries(menuItems)) {
    test(`should validate menu items in ${lang} (parametrized test) @regression`, async ({
      page,
    }) => {
      // Arrange
      await page.goto(`/${data.lang}`);
      await expect(page).toHaveTitle(/IDV Suite/);
      await page.waitForLoadState();
      await page
        .locator('[data-test="input-right-icon"]')
        .click({ force: true });

      // Act
      const menuElements = page.getByRole('menuitem');
      const actualTexts = await menuElements.allTextContents();

      // Assert
      expect(actualTexts).toEqual(data.texts);
    });
  }
  for (const [lang, data] of Object.entries(expectedNavLinks)) {
    test(`should validate nav links in ${lang} @smoke`, async ({ page }) => {
      // Arrange
      await page.goto(`/${data.lang}`);
      await expect(page).toHaveTitle(/IDV Suite/);
      await page.waitForLoadState();

      // Act
      for (const link of data.texts) {
        const navItem = page.locator(`[data-test="${link.dataTest}"]`);
        const anchor = navItem.locator('a');

        // Assert
        await expect(anchor).toHaveAttribute('href', link.href);
        await expect(navItem.locator('p')).toHaveText(link.text);
      }
    });
  }
});

test.describe('Validation of Operations', () => {
  test('Should visit operations', async ({ page }) => {
    await page.goto('/en/operations');
    // await page.waitForLoadState();
    await page.getByText('Operation-0').isVisible();
  });
});
