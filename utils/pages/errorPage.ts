import { Page, expect } from '@playwright/test';
import { dashboardCommands, loginCommands, stepPOM } from 'utils/controller/e2e';

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
    await this.page.waitForURL(/.*unauthorized.*/);
    const errorImage = this.page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();

    const firstErrorText = this.page.getByText(
      "It looks like you don't have access to this resource"
    );
    await expect(firstErrorText).toBeVisible();

    const secondErrorText = this.page.getByText('Please, contact the administrator');
    await expect(secondErrorText).toBeVisible();

    const homeButton = this.page.locator('[data-test="error-button"]');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toBeEnabled();
    await expect(homeButton).toMatchAriaSnapshot(`
    - button "Go back to Login page":
      - img
      - text: Go back to Login page
  `);
  }

  @stepPOM('Validate error (mocked) page UI elements')
  async validatesErrorMockedPageUI() {
    const topLogo = this.page.getByRole('img').first();
    await expect(topLogo).toBeVisible();

    const errorImage = this.page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();

    const firstErrorText = this.page.getByText('Something went wrong');
    await expect(firstErrorText).toBeVisible();

    const secondErrorText = this.page.getByText('Retry later');
    await expect(secondErrorText).toBeVisible();

    const homeButton = this.page.locator('[data-test="error-button"]').getByText('Land here');
    await expect(homeButton).toBeVisible();
    await expect(homeButton).toBeEnabled();
  }

  @stepPOM('Validate old error page UI elements')
  async validatesOldErrorPage() {
    const topLogo = this.page.getByRole('img').first();
    await expect(topLogo).toBeVisible();

    const errorImage = this.page.getByRole('img', { name: 'Error image' });
    await expect(errorImage).toBeVisible();

    const firstErrorText = this.page.getByText('Houstoooon, Something went wrong');
    await expect(firstErrorText).toBeVisible();

    const secondErrorText = this.page.getByText('Click below to land in IDV Suite.');
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

  @stepPOM('Click on error button and verifies redirection to login page')
  async clickReturnButtonAndVerifyRedirection(loginPage: loginCommands) {
    await this.page.locator('[data-test="error-button"]').click();
    await loginPage.seesLoginPage();
  }

  @stepPOM('Click on error button and verifies redirection to login page')
  async clicksOnErrorButtonSeesLanding(dashboardPage: dashboardCommands) {
    await this.page.locator('[data-test="error-button"]').click();
    await dashboardPage.loadsURLSkipsTutorial();
  }
}
