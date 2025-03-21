import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class loginCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Logs-in with an unsigned user')
  async loginUnsigned() {
    if (!process.env.USER_EMAIL_1 || !process.env.USER_PASSWORD_1) {
      throw new Error("Env variables USER_EMAIL e USER_PASSWORD aren't set");
    }

    await this.page.waitForSelector('form', { state: 'visible' });

    const emailInput = this.page.getByRole('textbox', { name: 'Email address' });
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.focus();
    await emailInput.fill(process.env.USER_EMAIL_1);

    const emailValue = await emailInput.inputValue();
    expect(emailValue).toBe(process.env.USER_EMAIL_1);

    const nextButton = this.page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible' });
    await nextButton.click();

    const passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.focus();
    await passwordInput.fill(process.env.USER_PASSWORD_1);

    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.page.waitForURL(/.*tenant.*/, { waitUntil: 'commit' });

    // Failsafe
    await expect(this.page.getByRole('img', { name: 'Error image' })).not.toBeVisible({
      timeout: 1000,
    });
    await expect(this.page.getByText('Sorry, aliens have stolen our server')).not.toBeVisible({
      timeout: 1000,
    });
  }

  @stepPOM('Validates logout page redirection')
  async seesLoginPage() {
    await expect(this.page).toHaveURL(/.*login.*/);
    await expect(this.page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  }

  @stepPOM('Loads main page after login')
  async loadsMainPage() {
    await this.page.waitForURL(/.*tenant.*/);
  }

  // Accessibility

  @stepPOM('Validates all Aria attributes in the Dashboard page')
  async seesAriaAttributesDashboard() {
    await expect(this.page.locator('[data-test="header"]')).toMatchAriaSnapshot(`
      - paragraph: Dashboard
      - button "demo":
        - paragraph: demo
        - img
      - button /Avatar .+@facephi\.com/:
        - img "Avatar"
        - paragraph: /.+@facephi\.com/
        - img
    `);

    await expect(this.page.getByRole('main')).toMatchAriaSnapshot(`
      - main:
        - paragraph: Dashboard
        - button "demo":
          - paragraph: demo
          - img
        - button /Avatar .+@facephi\.com/:
          - img "Avatar"
          - paragraph: /.+@facephi\.com/
          - img
        - button:
          - img
        - textbox "Filter by date"
        - checkbox "24 hours"
        - checkbox "7 days" [checked]
        - checkbox "30 days"
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: /\\d+/
        - paragraph: Authentications
        - img
        - paragraph: /\\d+/
        - paragraph: Onboardings
        - paragraph: All operations (%)
        - paragraph: Succesful
        - paragraph: Started
        - paragraph: Expired
        - paragraph: Cancelled
        - paragraph: Blocked
        - paragraph: Rejected
        - paragraph: Error
        - paragraph: Success rate
        - paragraph
        - paragraph: Error rate
        - paragraph
    `);

    await expect(this.page.locator('body')).toMatchAriaSnapshot(
      `
      - alert
      - link:
        - img
      - list:
        - listitem:
          - link "Dashboard":
            - img
            - paragraph: Dashboard
        - listitem:
          - link "Operations":
            - img
            - paragraph: Operations
      - list:
        - img
        - paragraph: Operations
        - button "Application":
          - img
          - paragraph: Application
      - main:
        - paragraph: Dashboard
        - button "demo":
          - paragraph: demo
          - img
        - button /Avatar .+@facephi\.com/:
          - img "Avatar"
          - paragraph: /.+@facephi\.com/
          - img
        - button:
          - img
        - textbox "Filter by date"
        - checkbox "24 hours"
        - checkbox "7 days" [checked]
        - checkbox "30 days"
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: /\\d+/
        - paragraph: Authentications
        - img
        - paragraph: /\\d+/
        - paragraph: Onboardings
        - paragraph: All operations (%)
        - paragraph: Succesful
        - paragraph: Started
        - paragraph: Expired
      `
    );
  }
  @stepPOM('Compares Aria content with UI screenshots')
  async comparesAriaSnapshotScreenshots(browserName: string) {
    await expect(this.page.getByRole('main')).toHaveScreenshot(
      `dashboard-main-content-${browserName}.png`
    );

    await expect(this.page.locator('body')).toHaveScreenshot(
      `dashboard-sidebar-${browserName}.png`
    );
  }
}
