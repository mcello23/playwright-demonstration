import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class DashboardAndOperationNavigation {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Sees the header logo')
  async mainElementsVisible() {
    await this.page.waitForURL(/.*tenant.*/);
    const headerLogoLocator = this.page.locator('[data-test="header-logo"]');
    await expect(headerLogoLocator).toBeVisible();
    await expect(headerLogoLocator).toBeEnabled();
  }

  @stepPOM('Checks Operations icon color')
  async operationsIconColor() {
    const operationsLocator = this.page.locator('[data-test="app-Operations"]');
    const iconWrapper = operationsLocator.locator(
      'div.facephi-ui-icon-wrapper[style*="background-color: var(--colors-yellow400)"]'
    );
    await expect(iconWrapper).toBeVisible();
  }

  @stepPOM('Checks Dashboard HREF link')
  async dashboardHREFLink() {
    const dashboardLocator = this.page.locator('[data-test="Dashboard"] > a');
    await dashboardLocator.isVisible();
    await dashboardLocator.isEnabled();

    const hrefValueDash = await dashboardLocator.getAttribute('href');
    const expectedHrefDash = '/en/tenant/idv-demo';
    expect(hrefValueDash).toBe(expectedHrefDash);
  }

  @stepPOM('Checks Operations HREF link')
  async operationsHREFLink() {
    const operationsLocator = this.page.locator('[data-test="Operations"] > a');
    await operationsLocator.isVisible();
    await operationsLocator.isEnabled();

    const hrefValueOperations = await operationsLocator.getAttribute('href');
    const expectedHrefOperations = '/en/tenant/idv-demo/operations';
    expect(hrefValueOperations).toBe(expectedHrefOperations);
  }

  @stepPOM('Clicks on Operations and validates URL')
  async clicksNavigationValidatesURL() {
    await this.page.locator('[data-test="Operations"]').click();
    await this.page.waitForURL('**/operations');
  }

  @stepPOM('Validates Dashboard and Operations links')
  async validateDashboardAndOperations() {
    await this.mainElementsVisible();
    await this.operationsIconColor();
    await this.dashboardHREFLink();
    await this.operationsHREFLink();
    await this.clicksNavigationValidatesURL();
  }
}

export class AntifraudAndRulesNavigation {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Goes to Antifraud')
  async goesToAntifraud() {
    await this.page.getByRole('button', { name: 'Application' }).click();
    await this.page.waitForSelector('.facephi-ui-portal__container');
    await this.page.getByRole('listitem').filter({ hasText: 'Antifraud' }).click();
    await this.page.waitForURL('**/antifraud');
    await expect(this.page.locator('[data-test="header"]').getByText('Antifraud')).toBeVisible();
  }

  @stepPOM('Checks Antifraud icon color')
  async antifraudIconColor() {
    const iconWrapper = this.page.locator(
      'div.facephi-ui-icon-wrapper[style*="background-color: var(--colors-tomato400)"]'
    );
    await expect(iconWrapper).toBeVisible();
  }

  @stepPOM('Checks Rejected HREF link properties')
  async rejectedHREFLinkProperties() {
    const rejectedLocator = this.page.locator('[data-test="RejectedList"] > a');
    await rejectedLocator.isVisible();
    await rejectedLocator.isEnabled();

    const rejectedHref = await rejectedLocator.getAttribute('href');
    const expectedRejectedHref = '/en/tenant/idv-demo/antifraud';
    expect(rejectedHref).toBe(expectedRejectedHref);
  }

  @stepPOM('Validates Rules href values and URL')
  async rulesHREFLink() {
    const rulesLocator = this.page.locator('[data-test="Rules"] > a');
    await rulesLocator.isVisible();
    await rulesLocator.isEnabled();

    const rulesHref = await rulesLocator.getAttribute('href');
    const expectedRulesHref = '/en/tenant/idv-demo/antifraud/rules';
    expect(rulesHref).toBe(expectedRulesHref);
  }

  @stepPOM('Navigate to Rules page and verify URL')
  async rulesClickAndRedirection() {
    await this.page.locator('[data-test="Rules"]').click();
    await this.page.waitForURL('**/antifraud/rules');
  }
}

export class FlowsAndIntegrationsNavigation {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Goes to Flows')
  async goesToFlows() {
    await this.page.getByRole('button', { name: 'Application' }).click();
    await this.page.waitForSelector('.facephi-ui-portal__container');
    await this.page.getByRole('listitem').filter({ hasText: 'Flows' }).click();
    await this.page.waitForURL('**/flows');
    await expect(this.page.locator('[data-test="header"]').getByText('Flows')).toBeVisible();
  }

  @stepPOM('Validate Flows icon color')
  async validateFlowsIconColor() {
    const flowsDiv = this.page.locator('div', { hasText: 'Flows' });
    const iconWrapper = flowsDiv.locator(
      '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-pink400)"]'
    );
    await expect(iconWrapper).toBeVisible();
  }

  @stepPOM('Validate Flows link properties')
  async validateFlowsLinkProperties() {
    const flowsLocator = this.page.locator('[data-test="Flows"] > a');
    await flowsLocator.isVisible();
    await flowsLocator.isEnabled();

    const flowsHref = await flowsLocator.getAttribute('href');
    const expectedFlowsHref = '/en/tenant/idv-demo/flows';
    expect(flowsHref).toBe(expectedFlowsHref);
  }

  @stepPOM('Validate Integrations link properties')
  async validateIntegrationsLinkProperties() {
    const integrationsLocator = this.page.locator('[data-test="Integrations"] > a');
    await integrationsLocator.isVisible();
    await integrationsLocator.isEnabled();

    const integrationsHref = await integrationsLocator.getAttribute('href');
    const expectedIntegrationsHref = '/en/tenant/idv-demo/integrations';
    expect(integrationsHref).toBe(expectedIntegrationsHref);
  }

  @stepPOM('Navigate to Integrations page and verify URL')
  async navigateToIntegrationsAndVerifyUrl() {
    await this.page.locator('[data-test="Integrations"]').click();
    await this.page.waitForURL('**/integrations');
  }
}

export class IdentitiesNavigation {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Goes to Identities')
  async goesToIdentities() {
    await this.page.getByRole('button', { name: 'Application' }).click();
    await this.page.waitForSelector('.facephi-ui-portal__container');
    await this.page.getByRole('listitem').filter({ hasText: 'Identities' }).click();
    await this.page.waitForURL('**/identities');
    await expect(this.page.locator('[data-test="header"]').getByText('Identities')).toBeVisible();
  }

  @stepPOM('Validate Identities icon color')
  async validateIdentitiesIconColor() {
    const identitiesDiv = this.page.locator('div', { hasText: 'Identities' });
    const iconWrapper = identitiesDiv.locator(
      '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-blue400)"]'
    );
    await expect(iconWrapper).toBeVisible();
  }

  @stepPOM('Validate Identities List link properties')
  async validateIdentitiesListProperties() {
    const identitiesLocator = this.page.locator('[data-test="List"] > a');
    await identitiesLocator.isVisible();
    await identitiesLocator.isEnabled();

    const identitiesHref = await identitiesLocator.getAttribute('href');
    const expectedIDHref = '/en/tenant/idv-demo/identities';
    expect(identitiesHref).toBe(expectedIDHref);
  }
}

export class UserManagementNavigation {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Goes to User Management')
  async goesToUserManagement() {
    await this.page.getByRole('button', { name: 'Application' }).click();
    await this.page.waitForSelector('.facephi-ui-portal__container');
    await this.page.getByRole('listitem').filter({ hasText: 'User Management' }).click();
    await this.page.waitForURL('**/user-management');
    await expect(
      this.page.locator('[data-test="header"]').getByText('User management')
    ).toBeVisible();
  }

  @stepPOM('Validate User Management icon color')
  async validateUserManagementIconColor() {
    const identitiesDiv = this.page.locator('div', { hasText: 'User management' });
    const iconWrapper = identitiesDiv.locator(
      '.facephi-ui-icon-wrapper[style*="background-color: var(--colors-orange400)"]'
    );
    await expect(iconWrapper).toBeVisible();
  }

  @stepPOM('Validate Users link properties')
  async validateUsersLinkProperties() {
    const identitiesLocator = this.page.locator('[data-test="Users"] > a');
    await identitiesLocator.isVisible();
    await identitiesLocator.isEnabled();

    const identitiesHref = await identitiesLocator.getAttribute('href');
    const expectedIDHref = '/en/tenant/idv-demo/user-management';
    expect(identitiesHref).toBe(expectedIDHref);
  }
}

export interface NavigationTest {
  name: string;
  url: string;
  fixtureKey:
    | 'operationsAndDasbhaord'
    | 'antifraudAndRules'
    | 'flowsAndIntegrations'
    | 'identitiesNavigation'
    | 'userManagementNavigation';
  setup: (fixture: any) => Promise<void>;
  validate: (fixture: any, missingString: any) => Promise<void>;
}

export class NavigationTestsManager {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Method to get all the tests
  getTests(): NavigationTest[] {
    return navigationTestsConfig;
  }
}

export const navigationTestsConfig: NavigationTest[] = [
  {
    name: 'Dashboard',
    url: '/en/tenant/idv-demo',
    fixtureKey: 'operationsAndDasbhaord',
    setup: async () => {},
    validate: async (fixture, missingString) => {
      await fixture.operationsIconColor();
      await fixture.dashboardHREFLink();
      await missingString.validateMissingString();
    },
  },
  {
    name: 'Operations',
    url: '/en/tenant/idv-demo/operations',
    fixtureKey: 'operationsAndDasbhaord',
    setup: async () => {},
    validate: async (fixture, missingString) => {
      await fixture.operationsHREFLink();
      await fixture.clicksNavigationValidatesURL();
      await missingString.validateMissingString();
    },
  },
  {
    name: 'Antifraud',
    url: '/en/tenant/idv-demo/antifraud',
    fixtureKey: 'antifraudAndRules',
    setup: async (fixture) => {
      await fixture.goesToAntifraud();
    },
    validate: async (fixture, missingString) => {
      await fixture.antifraudIconColor();
      await fixture.rejectedHREFLinkProperties();
      await missingString.validateMissingString();
    },
  },
  {
    name: 'Rules',
    url: '/en/tenant/idv-demo/antifraud/rules',
    fixtureKey: 'antifraudAndRules',
    setup: async (fixture) => {
      await fixture.goesToAntifraud();
    },
    validate: async (fixture, missingString) => {
      await fixture.rulesHREFLink();
      await fixture.rulesClickAndRedirection();
      await missingString.validateMissingString();
    },
  },
  {
    name: 'Flows',
    url: '/en/tenant/idv-demo/flows',
    fixtureKey: 'flowsAndIntegrations',
    setup: async (fixture) => {
      await fixture.goesToFlows();
    },
    validate: async (fixture, missingString) => {
      await fixture.validateFlowsIconColor();
      await fixture.validateFlowsLinkProperties();
      await missingString.validateMissingString();
    },
  },
  {
    name: 'Integrations',
    url: '/en/tenant/idv-demo/integrations',
    fixtureKey: 'flowsAndIntegrations',
    setup: async (fixture) => {
      await fixture.goesToFlows();
    },
    validate: async (fixture, missingString) => {
      await fixture.validateIntegrationsLinkProperties();
      await fixture.navigateToIntegrationsAndVerifyUrl();
      await missingString.validateMissingString();
    },
  },
  {
    name: 'Identities',
    url: '/en/tenant/idv-demo/identities',
    fixtureKey: 'identitiesNavigation',
    setup: async (fixture) => {
      await fixture.goesToIdentities();
    },
    validate: async (fixture, missingString) => {
      await fixture.validateIdentitiesIconColor();
      await fixture.validateIdentitiesListProperties();
      await missingString.validateMissingString();
    },
  },
  {
    name: 'User Management',
    url: '/en/tenant/idv-demo/user-management',
    fixtureKey: 'userManagementNavigation',
    setup: async (fixture) => {
      await fixture.goesToUserManagement();
    },
    validate: async (fixture, missingString) => {
      await fixture.validateUserManagementIconColor();
      await fixture.validateUsersLinkProperties();
      await missingString.validateMissingString();
    },
  },
];
