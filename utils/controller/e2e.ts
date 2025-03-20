import { test as baseTest, expect, Page } from '@playwright/test';
import { description, tag, tags } from 'allure-js-commons';
import { apiCommands } from 'utils/helpers/apiHelpers';
import { CalendarCommands, verifyDateRangeInput } from 'utils/helpers/calandarHelper';
import {
  ErrorFixtureOptions,
  MockCommands,
  SimulateTimeoutOptions,
} from 'utils/helpers/mockFixtures';
import { dashboardCommands } from 'utils/pages/dashboardPage';
import { loginCommands } from 'utils/pages/loginPage';
import { operationPageCommands } from 'utils/pages/operationsPage';

export function stepPOM(stepName?: string) {
  return function decorator(target: Function, context?: ClassMethodDecoratorContext | undefined) {
    return function replacementMethod(this: any, ...args: any[]) {
      const name = stepName || context?.name?.toString() || target.name || 'Anonymous function';

      return test.step(name, async () => {
        return await target.apply(this, args);
      });
    };
  };
}

// Navigation helpers
export async function expectNoResponse(
  page: Page,
  urlPattern: string | RegExp,
  options = { timeout: 1000 }
) {
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

interface CustomFixtures {
  loginPage: loginCommands;
  operationPage: operationPageCommands;
  apiHelpers: apiCommands;
  dashboardPage: dashboardCommands;
  calendarHelper: CalendarCommands;
  mockHelpers: MockCommands;
  simulateServerError: (options: ErrorFixtureOptions) => Promise<void>;
  simulateTimeout: (options: SimulateTimeoutOptions) => Promise<void>;
  simulateForbidden: (options: ErrorFixtureOptions) => Promise<void>;
  simulateUnauthorized: (options: ErrorFixtureOptions) => Promise<void>;
}

export const test = baseTest.extend<CustomFixtures>({
  page: async ({ page }: { page: Page }, use: (page: Page) => Promise<void>) => {
    test.step('Goes to baseURL', async () => {
      await page.goto('/');
      await use(page);
    });
    // afterEach cleanup logic here
  },

  loginPage: async ({ page }: { page: Page }, use: (loginPage: loginCommands) => Promise<void>) => {
    const login = new loginCommands(page);
    await use(login);
  },

  operationPage: async (
    { page }: { page: Page },
    use: (operationPage: operationPageCommands) => Promise<void>
  ) => {
    const operation = new operationPageCommands(page);
    await use(operation);
  },

  apiHelpers: async ({ page }: { page: Page }, use: (api: apiCommands) => Promise<void>) => {
    const api = new apiCommands(page);
    await use(api);
  },

  dashboardPage: async (
    { page }: { page: Page },
    use: (dashboardPage: dashboardCommands) => Promise<void>
  ) => {
    const dashboard = new dashboardCommands(page);
    await use(dashboard);
  },

  calendarHelper: async (
    { page }: { page: Page },
    use: (calendar: CalendarCommands) => Promise<void>
  ) => {
    const calendar = new CalendarCommands(page, new Date());
    await use(calendar);
  },

  mockHelpers: async ({ page }: { page: Page }, use: (mock: MockCommands) => Promise<void>) => {
    const mock = new MockCommands(page);
    await use(mock);
  },
});

export {
  apiCommands,
  CalendarCommands,
  dashboardCommands,
  description,
  expect,
  loginCommands,
  MockCommands,
  operationPageCommands,
  tag,
  tags,
  verifyDateRangeInput,
};
