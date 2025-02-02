import { expect, test } from '@playwright/test';

const menuItems = {
  es: {
    lang: 'es',
  },
  en: {
    lang: 'en',
  },
  pt: {
    lang: 'pt',
  },
};

for (const [lang] of Object.entries(menuItems)) {
  test(`should execute a visual test for ${lang}`, async ({ page }) => {
    // Arrange
    await page.goto(`/${lang}`);
    await expect(page).toHaveTitle(/IDV Suite/);

    // Act
    const screenshotPath = `visual-tests/${lang}-menu.png`;
    await page.screenshot({ path: screenshotPath });

    // Assert
    await expect(page).toHaveScreenshot(screenshotPath, {
      timeout: 15000,
      maxDiffPixelRatio: 0.2,
    });
  });
}
