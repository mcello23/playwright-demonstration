import { test as baseTest, expect, Page } from '@playwright/test';
import { description, tag, tags } from 'allure-js-commons';
import { apiCommands } from 'utils/helpers/apiHelper';
import { CalendarCommands, verifyDateRangeInput } from 'utils/helpers/calandarHelper';
import { ErrorForceCommands } from 'utils/helpers/errorHelper';
import { MockCommands } from 'utils/helpers/mockFixtures';
import {
  AntifraudAndRulesNavigation,
  DashboardAndOperationNavigation,
  FlowsAndIntegrationsNavigation,
  IdentitiesNavigation,
  UserManagementNavigation,
} from 'utils/helpers/navigationHelper';
import { dashboardCommands, DashboardStringsValidation } from 'utils/pages/dashboardPage';
import { ErrorPageNavigation } from 'utils/pages/errorPage';
import { loginCommands } from 'utils/pages/loginPage';
import { operationPageCommands, OperationsStringsValidation } from 'utils/pages/operationsPage';

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

class MissingStringCommand {
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

interface CustomFixtures {
  loginPage: loginCommands;
  operationPage: operationPageCommands;
  apiHelpers: apiCommands;
  dashboardPage: dashboardCommands;
  calendarHelper: CalendarCommands;
  mockHelpers: MockCommands;
  operationsAndDasbhaord: DashboardAndOperationNavigation;
  antifraudAndRules: AntifraudAndRulesNavigation;
  flowsAndIntegrations: FlowsAndIntegrationsNavigation;
  identitiesNavigation: IdentitiesNavigation;
  userManagementNavigation: UserManagementNavigation;
  errorPageNavigation: ErrorPageNavigation;
  errorCommands: ErrorForceCommands;
  MissingString: MissingStringCommand;
  dashboardStrings: DashboardStringsValidation;
  operationsStrings: OperationsStringsValidation;
}

export const test = baseTest.extend<CustomFixtures>({
  page: async ({ page }: { page: Page }, use: (page: Page) => Promise<void>) => {
    test.step('Goes to baseURL', async () => {
      await page.goto('/', { waitUntil: 'commit' });
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

  operationsAndDasbhaord: async (
    { page }: { page: Page },
    use: (operationsAndDasbhaord: DashboardAndOperationNavigation) => Promise<void>
  ) => {
    const operationsAndDasbhaord = new DashboardAndOperationNavigation(page);
    await use(operationsAndDasbhaord);
  },

  antifraudAndRules: async (
    { page }: { page: Page },
    use: (antifraudAndRules: AntifraudAndRulesNavigation) => Promise<void>
  ) => {
    const antifraudAndRules = new AntifraudAndRulesNavigation(page);
    await use(antifraudAndRules);
  },

  flowsAndIntegrations: async (
    { page }: { page: Page },
    use: (flowsAndIntegrations: FlowsAndIntegrationsNavigation) => Promise<void>
  ) => {
    const flowsAndIntegrations = new FlowsAndIntegrationsNavigation(page);
    await use(flowsAndIntegrations);
  },

  identitiesNavigation: async (
    { page }: { page: Page },
    use: (identitiesNavigation: IdentitiesNavigation) => Promise<void>
  ) => {
    const identitiesNavigation = new IdentitiesNavigation(page);
    await use(identitiesNavigation);
  },

  userManagementNavigation: async (
    { page }: { page: Page },
    use: (userManagementNavigation: UserManagementNavigation) => Promise<void>
  ) => {
    const userManagementNavigation = new UserManagementNavigation(page);
    await use(userManagementNavigation);
  },

  errorPageNavigation: async (
    { page }: { page: Page },
    use: (errorPageNavigation: ErrorPageNavigation) => Promise<void>
  ) => {
    const errorPageNavigation = new ErrorPageNavigation(page);
    await use(errorPageNavigation);
  },

  mockHelpers: async ({ page }: { page: Page }, use: (mock: MockCommands) => Promise<void>) => {
    const mock = new MockCommands(page);
    await use(mock);
  },

  MissingString: async (
    { page }: { page: Page },
    use: (MissingString: MissingStringCommand) => Promise<void>
  ) => {
    const MissingString = new MissingStringCommand(page);
    await use(MissingString);
  },

  errorCommands: async (
    { page }: { page: Page },
    use: (errorCommands: ErrorForceCommands) => Promise<void>
  ) => {
    const errorCommands = new ErrorForceCommands(page);
    await use(errorCommands);
  },
  dashboardStrings: async ({ page }, use) => {
    const dashboardStrings = new DashboardStringsValidation(page);
    await use(dashboardStrings);
  },
  operationsStrings: async ({ page }, use) => {
    const operationsStrings = new OperationsStringsValidation(page);
    await use(operationsStrings);
  },
});

export {
  apiCommands,
  CalendarCommands,
  DashboardAndOperationNavigation,
  dashboardCommands,
  DashboardStringsValidation,
  description,
  ErrorForceCommands,
  ErrorPageNavigation,
  expect,
  FlowsAndIntegrationsNavigation,
  IdentitiesNavigation,
  loginCommands,
  MissingStringCommand,
  MockCommands,
  operationPageCommands,
  OperationsStringsValidation,
  tag,
  tags,
  UserManagementNavigation,
  verifyDateRangeInput,
};
