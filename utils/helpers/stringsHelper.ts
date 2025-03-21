import { expect, Locator, Page } from '@playwright/test';

export interface TextAssertion {
  locator: Locator;
  isEnabled: boolean;
}

export class StringsValidationBase {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateTexts(assertions: TextAssertion[]) {
    for (const assertion of assertions) {
      if (assertion.isEnabled) {
        await expect(assertion.locator).toBeEnabled();
      } else {
        await expect(assertion.locator).toBeVisible();
      }
    }
  }
}
