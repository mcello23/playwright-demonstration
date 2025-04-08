import { test as baseTest, expect, Page } from '@playwright/test';
import { description } from 'allure-js-commons';
import { CalendarCommands, verifyDateRangeInput } from 'utils/helpers/calandarHelper';
import { ErrorForceCommands, MissingStringCommand } from 'utils/helpers/miscHelper';
import { MockCommands } from 'utils/helpers/mockFixtures';
import {
  AntifraudAndRulesNavigation,
  DashboardAndOperationNavigation,
  FlowsAndIntegrationsNavigation,
  IdentitiesNavigation,
  navigationTestsConfig,
  NavigationTestsManager,
  UserManagementNavigation,
} from 'utils/helpers/navigationHelper';
import { apiCommands, rscCommands } from 'utils/helpers/networkHelper';
import { dashboardCommands, DashboardStringsValidation } from 'utils/pages/dashboardPage';
import { ErrorPageNavigation } from 'utils/pages/errorPage';
import { loginCommands } from 'utils/pages/loginPage';
import { operationDetailCommands } from 'utils/pages/operationsDetailPage';
import { operationPageCommands, OperationsStringsValidation } from 'utils/pages/operationsPage';
import { userManagementCommands } from 'utils/pages/userManagementPage';

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
  errorPage: ErrorPageNavigation;
  errorCommands: ErrorForceCommands;
  missingString: MissingStringCommand;
  dashboardStrings: DashboardStringsValidation;
  operationsStrings: OperationsStringsValidation;
  operationDetailPage: operationDetailCommands;
  navigationTestsManager: NavigationTestsManager;
  userManagementPage: userManagementCommands;
  rscHelpers: rscCommands;
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

  rscHelpers: async ({ page }: { page: Page }, use: (rsc: rscCommands) => Promise<void>) => {
    const rsc = new rscCommands(page);
    await use(rsc);
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

  errorPage: async (
    { page }: { page: Page },
    use: (errorPage: ErrorPageNavigation) => Promise<void>
  ) => {
    const errorPage = new ErrorPageNavigation(page);
    await use(errorPage);
  },

  mockHelpers: async ({ page }: { page: Page }, use: (mock: MockCommands) => Promise<void>) => {
    const mock = new MockCommands(page);
    await use(mock);
  },

  missingString: async (
    { page }: { page: Page },
    use: (missingString: MissingStringCommand) => Promise<void>
  ) => {
    const missingString = new MissingStringCommand(page);
    await use(missingString);
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
  operationDetailPage: async (
    { page }: { page: Page },
    use: (operationDetailPage: operationDetailCommands) => Promise<void>
  ) => {
    const operationDetailPage = new operationDetailCommands(page);
    await use(operationDetailPage);
  },
  navigationTestsManager: async (
    { page }: { page: Page },
    use: (navigationTestsManager: NavigationTestsManager) => Promise<void>
  ) => {
    const manager = new NavigationTestsManager(page);
    await use(manager);
  },
  userManagementPage: async (
    { page }: { page: Page },
    use: (userManagementPage: userManagementCommands) => Promise<void>
  ) => {
    const userManagementPage = new userManagementCommands(page);
    await use(userManagementPage);
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
  navigationTestsConfig,
  NavigationTestsManager,
  operationDetailCommands,
  operationPageCommands,
  OperationsStringsValidation,
  rscCommands,
  userManagementCommands,
  UserManagementNavigation,
  verifyDateRangeInput,
};
