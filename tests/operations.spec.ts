import { faker } from '@faker-js/faker';
import { expect, test } from '../utils/test-extend.ts';

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

test.describe('Operations page validation @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="Operations"]').click();
  });
  test('I want to see all elements in Operations page @smoke', async ({ page }) => {
    // Static elements
    page.locator('[data-test="filter-by-date"]').isEnabled();
    page.locator('[data-test="filter-by-date"]').isVisible();
    page.locator('[data-test="filter-by-name"]').isEnabled();
    page.locator('[data-test="filter-by-name"]').isVisible();
    page.locator('[data-test="filter-button"]').isEnabled();
    page.locator('[data-test="filter-button"]').isVisible();

    // Test Filter date
    const daysInPast = 30;
    const daysInFuture = 30;
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() - daysInPast));
    const endDate = new Date(today.setDate(today.getDate() + daysInFuture));

    const formattedDateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

    const filterByDateLocator = page.locator('[data-test="filter-by-date"]');
    await filterByDateLocator.click();
    await filterByDateLocator.fill(formattedDateRange);
    await expect(filterByDateLocator).toHaveValue(formattedDateRange);

    // Test Search input
    page.locator('[data-test="filter-by-name"]').isEnabled();
    const randomWord = faker.lorem.word(5);
    page.locator('[data-test="filter-by-name"]').fill(randomWord);
    await page.locator('[data-test="clear-all"]').isVisible();
    await page.locator('[data-test="clear-all"]').click();
    expect(page.locator('[data-test="filter-by-name"]')).not.toHaveValue(randomWord);

    // Test Filter button
    page.locator('[data-test="filter-button"]').click();
    page.getByLabel('Onboarding').click();
    page.locator('[data-test="chip-ONBOARDING"]').isVisible();

    // Date and time format
    const dateRegex = /^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    await expect(page.getByText(dateRegex).nth(0)).toBeVisible();
    // Operation ID format
    const operationIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    await expect(page.getByText(operationIdRegex).nth(0)).toBeVisible();
    // Type format
    const typeOnboarding = page.locator('[data-test="table-row-0"]').getByText('Onboarding');
    await expect(typeOnboarding).toBeVisible();
    // Onboarding steps format
    const steps = page.locator('[data-test="table-row-0"]').getByRole('cell').filter({ hasText: /^$/ }).first();
    expect(steps).toBeVisible();
  });
});
