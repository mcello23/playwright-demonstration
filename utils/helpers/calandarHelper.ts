import { faker } from '@faker-js/faker';
import { expect, Locator, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class CalendarCommands {
  page: Page;
  date: Date;

  constructor(page: Page, date: Date) {
    this.page = page;
    this.date = date;
  }

  @stepPOM('Opens calendar component')
  async opensCalendar() {
    await this.page.locator('[data-test="input-container"]').getByRole('button').click();
  }

  @stepPOM('Gets day button')
  async getDayButton(day: number) {
    return this.page.locator(`td button.rdp-day_button`, { hasText: day.toString() }).first();
  }

  @stepPOM('Selects random date range')
  async selectRandomDateRange() {
    const { startDay, endDay } = getRandomDateRange();
    return this.selectDateRange(startDay, endDay);
  }

  @stepPOM('Selects specific date range')
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

  @stepPOM('Navigates to previous month')
  async goToPreviousMonth() {
    await this.page.getByRole('button', { name: 'Go to the Previous Month' }).click();
  }
}

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

function getRandomFormattedDateRange(): string {
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
