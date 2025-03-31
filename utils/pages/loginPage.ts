import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

interface UserCredentials {
  email: string;
  password: string;
}

export class loginCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Logs-in with an user')
  async loginUnsigned(credentials: UserCredentials) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password should be provided');
    }

    await this.page.waitForSelector('form', { state: 'visible' });

    const emailInput = this.page.getByRole('textbox', { name: 'Email address' });
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.focus();
    await emailInput.fill(credentials.email);

    const emailValue = await emailInput.inputValue();
    expect(emailValue).toBe(credentials.email);

    const nextButton = this.page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible' });
    await nextButton.click();

    const passwordInput = this.page.getByRole('textbox', { name: 'Password' });
    await passwordInput.waitFor({ state: 'visible' });
    await passwordInput.focus();
    await passwordInput.fill(credentials.password);

    await this.page.getByRole('button', { name: 'Continue' }).click();

    await this.page.waitForURL(/.*tenant.*/, { waitUntil: 'commit' });
    await this.page.locator('[data-test="welcome-modal-skip-button"]').click();

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
