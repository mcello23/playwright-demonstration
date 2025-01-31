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

test.describe('Login', () => {
  test('should be logged in', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveURL('/en');
    await expect(page).toHaveTitle(/IDV Suite/);
  });

  test('should validate elements in dashboard (with texts variables)', async ({
    page,
  }) => {
    await page.goto('/es');
    await expect(page).toHaveTitle(/IDV Suite/);
    // eslint-disable-next-line
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
    test(`should validate menu items in ${lang}`, async ({ page }) => {
      await page.goto(`/${data.lang}`);
      await expect(page).toHaveTitle(/IDV Suite/);
      await page
        .locator('[data-test="input-right-icon"]')
        // eslint-disable-next-line
        .click({ force: true });

      const menuElements = page.getByRole('menuitem');
      const actualTexts = await menuElements.allTextContents();

      expect(actualTexts).toEqual(data.texts);
    });
  }
});
