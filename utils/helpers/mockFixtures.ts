import { Page, Route } from '@playwright/test';
import { stepPOM } from '../controller/e2e';

export interface ErrorFixtureOptions {
  statusCode?: number;
  endpoint: string;
}

export interface SimulateTimeoutOptions {
  endpoint: string;
  timeoutMs?: number;
}

export class MockCommands {
  constructor(private page: Page) {}

  @stepPOM('Simulates a server error 500')
  async simulateServerError(options: ErrorFixtureOptions): Promise<void> {
    await this.page.route(options.endpoint, (route: Route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: true,
          message: 'Simulating error 500',
        }),
      });
    });
  }

  @stepPOM('Simulates a 408 request timeout')
  async simulateTimeout(options: SimulateTimeoutOptions): Promise<void> {
    await this.page.route(options.endpoint, async (route: Route) => {
      await new Promise((resolve) => setTimeout(resolve, options.timeoutMs ?? 60000));
      route.fulfill({
        status: 200,
        body: 'Simulating timeout',
      });
    });
  }

  @stepPOM('Simulates a 403 forbidden access')
  async simulateForbidden(options: ErrorFixtureOptions): Promise<void> {
    await this.page.route(options.endpoint, (route: Route) => {
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: true,
          message: 'Simulating forbidden',
        }),
      });
    });
  }

  @stepPOM('Simulates a 401 unauthorized access')
  async simulateUnauthorized(options: ErrorFixtureOptions): Promise<void> {
    await this.page.route(options.endpoint, (route: Route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: true,
          message: 'Simulating unauthorized',
        }),
      });
    });
  }
}
