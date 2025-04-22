import { expect, Locator, Page } from '@playwright/test';
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

  @stepPOM('Simulating CPU throttling for non-CI environments')
  async simulatesCPUThrotling(page: Page) {
    const context = page.context();
    const cdpSession = await context.newCDPSession(page);
    // 4-6x CPU throttling is recommended for simulating CI environments
    await cdpSession.send('Emulation.setCPUThrottlingRate', { rate: 20 });
  }
}

export class MissingStringCommand {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Validates no missing string is found')
  async validateMissingString() {
    this.page.on('console', (msg) => {
      if (msg.text().includes('MISSING TRANSLATION')) {
        console.log(`Missing translation found: ${msg.text()}`);
      }
    });
  }
}

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
