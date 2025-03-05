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

//GUI fixtures
export async function loginUnsigned(page: Page): Promise<void> {
  if (!process.env.USER_EMAIL || !process.env.USER_PASSWORD) {
    throw new Error("Env variables USER_EMAIL e USER_PASSWORD aren't set");
  }

  await page.waitForSelector('form', { state: 'visible' });

  const emailInput = page.getByRole('textbox', { name: 'Email address' });
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.focus();
  await emailInput.clear();
  await emailInput.fill(process.env.USER_EMAIL);

  const emailValue = await emailInput.inputValue();
  expect(emailValue).toBe(process.env.USER_EMAIL);

  const nextButton = page.getByRole('button', { name: 'Next' });
  await nextButton.waitFor({ state: 'visible' });
  await nextButton.click();

  const passwordInput = page.getByRole('textbox', { name: 'Password' });
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.focus();
  await passwordInput.clear();
  await passwordInput.fill(process.env.USER_PASSWORD);

  const passwordValue = await passwordInput.inputValue();
  expect(passwordValue).toBeTruthy();

  await page.getByRole('button', { name: 'Continue' }).click();
}

// Extend the base test fixture
export const test = baseTest.extend({
  // Add your custom fixtures here
  page: async ({ page }: { page: Page }, use: (page: Page) => Promise<void>) => {
    // This runs before each test that uses the page fixture
    await page.goto('/');

    // Execute any other beforeEach logic

    // Use the fixture
    await use(page);

    // This runs after each test that uses the page fixture
    // afterEach cleanup logic here
  },
});

export { expect };
