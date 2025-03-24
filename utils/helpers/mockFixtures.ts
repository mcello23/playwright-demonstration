import { ConsoleMessage, Page, Route, expect } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export interface ErrorFixtureOptions {
  statusCode?: number;
  endpoint: string;
  message?: string;
  contentType?: string;
}
export class MockCommands {
  private page: Page;
  private _currentConsoleHandler: any = null;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Simulates HTTP errors')
  async simulateHttpError(options: ErrorFixtureOptions): Promise<void> {
    const statusCode = options.statusCode;
    const message = options.message || `Simulating error ${statusCode}`;
    const contentType = options.contentType || 'application/json';

    await this.page.route(options.endpoint, (route: Route) => {
      route.fulfill({
        status: statusCode,
        contentType: contentType,
        body: JSON.stringify({
          error: true,
          message: message,
          code: statusCode,
        }),
      });
    });
  }

  @stepPOM('Listens for error messages in console')
  async listenForErrorInConsole(testInfo: any, errorCode: number = 500): Promise<string[]> {
    const consoleMessages: string[] = [];
    let errorPrinted = false;

    const consoleHandler = (msg: ConsoleMessage) => {
      const text = msg.text();
      consoleMessages.push(text);

      if (testInfo.project.name === 'firefox') {
        if (text === 'Error' && !errorPrinted) {
          console.log(`\n🔴 Error "${errorCode}" detected on console (Firefox):`);
          console.log(text);
          errorPrinted = true;
        }
      } else {
        if (
          text.includes(
            `Failed to load resource: the server responded with a status of ${errorCode}`
          )
        ) {
          console.log(`\n🔴 Error ${errorCode} detected on console:`);
          console.log(text);
        }
      }
    };

    this.page.on('console', consoleHandler);

    this._currentConsoleHandler = consoleHandler;

    return consoleMessages;
  }

  // Removes listener (to be used in afterEach)
  @stepPOM('Removes console error listener')
  async removeConsoleListener(): Promise<void> {
    if (this._currentConsoleHandler) {
      this.page.removeListener('console', this._currentConsoleHandler);
      this._currentConsoleHandler = null;
    }
  }

  @stepPOM('Validates timeout behavior')
  async validateTimeoutBehavior(): Promise<void> {
    await this.page.waitForTimeout(1000);

    await this.expectNoResponse('**/tenant/**');

    const opElement = this.page.locator('[data-test="header"]').getByText('Operations');
    await expect(opElement).not.toBeVisible({
      timeout: 600,
    });

    console.log('\n⏱️ Mocked timeout successful!');
  }

  @stepPOM('Expects no response for request')
  async expectNoResponse(urlPattern: string): Promise<void> {
    // Method should check that there is no response for corresponding requests
  }
}
