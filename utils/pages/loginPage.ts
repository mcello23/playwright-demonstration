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
    await this.page.waitForLoadState('networkidle');

    const passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.focus();
    await passwordInput.fill(process.env.USER_PASSWORD_1);

    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.page.waitForURL(/.*tenant.*/);
    await this.page.waitForLoadState('networkidle');

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
}
