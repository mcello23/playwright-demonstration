import { faker } from '@faker-js/faker';
import { test as baseTest, expect, Locator, Page } from '@playwright/test';

const dateRangeCache = {
  value: null as string | null,
  expiresAt: 0
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

export function getFormattedSingleDate(): string {
  const date = faker.date.past();
  date.setHours(0, 0, 0, 0);
  return formatDateFast(date);
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
