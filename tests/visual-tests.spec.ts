import { expect, test } from '@playwright/test';

const menuItems = {
  es: { lang: 'es' },
  en: { lang: 'en' },
  pt: { lang: 'pt' },
};

for (const [lang, data] of Object.entries(menuItems)) {
  test(`should execute a visual test for ${lang}`, async ({ page }) => {
    await page.goto(`/${data.lang}`);
    await expect(page).toHaveTitle(/IDV Suite/);

    await expect(page).toHaveScreenshot(`${lang}-menu.png`, {
      timeout: 15000,
      maxDiffPixelRatio: 0.2,
    });
  });
}
