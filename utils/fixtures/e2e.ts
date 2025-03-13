import { faker } from '@faker-js/faker';
import { test as baseTest, expect, Locator, Page, Request, Route } from '@playwright/test';

// Date range helpers
const dateRangeCache = {
  value: null as string | null,
  expiresAt: 0,
};

function formatDateFast(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

export function getRandomFormattedDateRange(): string {
  const startDate = faker.date.past();
  startDate.setHours(0, 0, 0, 0);

  const endDate = faker.date.future();
  endDate.setHours(0, 0, 0, 0);

  return `${formatDateFast(startDate)} - ${formatDateFast(endDate)}`;
}

export function getFormattedDateRange(): string {
  const now = Date.now();
  if (dateRangeCache.value && dateRangeCache.expiresAt > now) {
    return dateRangeCache.value;
  }

  const result = getRandomFormattedDateRange();

  dateRangeCache.value = result;
  dateRangeCache.expiresAt = now + 5000;

  return result;
}

export function getRandomDateRange(minStart = 1, maxStart = 15, maxEnd = 28) {
  const startDay = faker.number.int({ min: minStart, max: maxStart });
  const endDay = faker.number.int({ min: startDay + 1, max: maxEnd });
  return { startDay, endDay };
}

export class CalendarHelper {
  constructor(private page: Page) {}

  async opensCalendar() {
    await this.page.locator('[data-test="input-container"]').getByRole('button').click();
  }

  async getDayButton(day: number) {
    return this.page.locator(`td button.rdp-day_button`, { hasText: day.toString() }).first();
  }

  async selectRandomDateRange() {
    const { startDay, endDay } = getRandomDateRange();
    return this.selectDateRange(startDay, endDay);
  }

  async selectDateRange(startDay: number, endDay: number) {
    const startButton = await this.getDayButton(startDay);
    if (startButton) {
      await startButton.click();
    }
    const endButton = await this.getDayButton(endDay);
    if (endButton) {
      await endButton.click();
    }
  }

  async goToPreviousMonth() {
    await this.page.getByRole('button', { name: 'Go to the Previous Month' }).click();
  }
}

export async function verifyDateRangeInput(
  locator: Locator,
  expectedDateRange: string
): Promise<void> {
  const actualValue = await locator.inputValue();

  const [expectedStartDate, expectedEndDate] = expectedDateRange.split(' - ');
  const [actualStartDate, actualEndPart] = actualValue.split(' - ');

  expect(actualStartDate).toBe(expectedStartDate);

  const expectedEndDatePrefix = expectedEndDate.substring(0, 8);
  expect(actualEndPart).toContain(expectedEndDatePrefix);
}

// API fixtures
export async function validateOpenIDTokenRequest(route: Route, request: Request) {
  expect(request.method()).toBe('POST');
  console.log('Request method:', request.method());

  const body = new URLSearchParams(request.postData() || '');
  expect(body.get('grant_type')).toBe('authorization_code');
  expect(body.has('code')).toBe(true);
  expect(body.has('code_verifier')).toBe(true);
  expect(body.has('client_id')).toBe(true);

  await route.continue();
}

export async function validateOpenIDAuthResponse(route: Route) {
  const response = await route.fetch();
  console.log('Response status:', response.status());
  expect(response.status()).toBe(200);
  await route.continue();
}

export async function interceptGetAggreate(route: Route, request: Request) {
  expect(request.method()).toBe('POST');

  const postData = request.postDataJSON();
  expect(postData.operationName).toBe('getAggregateStatistics');

  const response = await route.fetch();
  expect(response.status()).toBe(200);

  console.log('Request method:', request.method());
  console.log('Response status:', response.status());
  console.log('Request body:', postData.operationName);

  await route.continue();
}

export async function interceptTenantExchange(route: Route, request: Request) {
  const expectedTenantId = '809b44ff-26af-4ffc-9bb8-5dd9b0e87c44';

  expect(request.method()).toBe('POST');
  console.log('Request method:', request.method());
  const requestBody = request.postDataJSON();
  expect(requestBody).toEqual({ tenantId: expectedTenantId });
  console.log('TenantID:', expectedTenantId);

  await route.continue();
}

export async function waitForMultipleRSCResponses(
  page: Page,
  count = 1,
  options = { timeout: 10000 }
) {
  try {
    for (let i = 0; i < count; i++) {
      const response = await page.waitForResponse(
        (response) => response.url().includes('_rsc=') && response.status() === 200,
        { timeout: options.timeout }
      );

      console.log(`✅ URL received: ${response.url()}`);
      console.log(`✅ Status: ${response.status()}`);
    }
  } catch (error) {
    console.warn('⚠️ Not able to capture all RSC requests. Continuing test...');
    await page.waitForTimeout(1000);
  }
}

//GUI fixtures
export async function loginUnsigned(page: Page): Promise<void> {
  if (!process.env.USER_EMAIL_1 || !process.env.USER_PASSWORD_1) {
    throw new Error("Env variables USER_EMAIL e USER_PASSWORD aren't set");
  }

  await page.waitForSelector('form', { state: 'visible' });

  const emailInput = page.getByRole('textbox', { name: 'Email address' });
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.focus();
  await emailInput.fill(process.env.USER_EMAIL_1);

  const emailValue = await emailInput.inputValue();
  expect(emailValue).toBe(process.env.USER_EMAIL_1);

  const nextButton = page.getByRole('button', { name: 'Next' });
  await nextButton.waitFor({ state: 'visible' });
  await nextButton.click();
  await page.waitForLoadState('networkidle');

  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.focus();
  await passwordInput.fill(process.env.USER_PASSWORD_1);

  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForLoadState('networkidle');

  await page.waitForURL(/.*tenant.*/);

  // Failsafe
  await expect(page.getByRole('img', { name: 'Error image' })).not.toBeVisible({ timeout: 1000 });
  await expect(page.getByText('Sorry, aliens have stolen our server')).not.toBeVisible({
    timeout: 1000,
  });
}

interface ErrorFixtureOptions {
  statusCode?: number;
  endpoint: string;
}

interface CustomFixtures {
  simulateServerError: (options: ErrorFixtureOptions) => Promise<void>;
  simulateTimeout: (options: { endpoint: string; timeoutMs?: number }) => Promise<void>;
}

export const test = baseTest.extend<CustomFixtures>({
  page: async ({ page }: { page: Page }, use: (page: Page) => Promise<void>) => {
    await page.goto('/');
    await use(page);
    // afterEach cleanup logic here
  },

  simulateServerError: async ({ page }, use) => {
    const simulateError = async (options: ErrorFixtureOptions) => {
      await page.route(options.endpoint, (route) => {
        route.fulfill({
          status: options.statusCode ?? 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: true,
            message: `Simulating error ${options.statusCode ?? 500}`,
          }),
        });
      });
    };

    await use(simulateError);
  },

  simulateTimeout: async ({ page }, use) => {
    const simulateTimeout = async (options: { endpoint: string; timeoutMs?: number }) => {
      await page.route(options.endpoint, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, options.timeoutMs ?? 60000));
        route.fulfill({
          status: 200,
          body: 'Simulating timeout',
        });
      });
    };

    await use(simulateTimeout);
  },
});

export { expect };
