import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class ErrorForceCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Simulates a timeout')
  async expectNoResponse(page: Page, urlPattern: string | RegExp, options = { timeout: 1000 }) {
    let responseReceived = false;

    const responsePromise = page
      .waitForResponse(urlPattern, { timeout: options.timeout })
      .then(() => {
        responseReceived = true;
      })
      .catch(() => {
        // Nothing, timeout expected
      });

    await page.waitForTimeout(options.timeout);
    await responsePromise;

    expect(responseReceived).toBeFalsy();
  }
}
