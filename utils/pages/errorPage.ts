import { Page, expect } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class ErrorPageNavigation {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Navigate to the application and then to an incorrect URL')
  async navigateToWrongURL() {
    await this.page.waitForSelector('[data-test="header"]');
    await this.page.goto('/wrong-url', { waitUntil: 'commit' });
  }

  @stepPOM('Validate error page UI elements')
  async validateErrorPageUI() {
    const topLogo = this.page.getByRole('img').first();
    await expect(topLogo).toBeVisible();

    const errorImage = this.page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();

    const firstErrorText = this.page.getByText('Houstoooon, something went wrong!');
    await expect(firstErrorText).toBeVisible();

    const secondErrorText = this.page.getByText('Click below to land in IDV Suite');
    await expect(secondErrorText).toBeVisible();

    const homeButton = this.page.locator('[data-test="error-button"]').getByText('Land here');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toBeEnabled();
  }

  @stepPOM('Verify error page appears')
  async verifyErrorPageAppears() {
    const errorImage = this.page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();
  }

  @stepPOM('Click return button and verify redirection to home page')
  async clickReturnButtonAndVerifyRedirection() {
    await this.page.locator('[data-test="error-button"]').click();
    await this.page.waitForURL(/.*tenant.*/);
    const homeLocator = this.page.locator('[data-test="header"]').getByText('Dashboard');
    await expect(homeLocator).toBeVisible();
  }
}
