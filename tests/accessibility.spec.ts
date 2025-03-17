import { expect, test } from 'utils/fixtures/e2e';
// This is an example that will be built upon
// It still doesn't test UX (focus, keyboard navigation, etc.)

test.describe('Accessibility and visual testing of UX in IDV', () => {
  test('Dashboard validation', async ({ page, browserName }) => {
    await page.waitForURL('**/tenant/**');

    await expect(page.locator('[data-test="header"]')).toMatchAriaSnapshot(`
      - paragraph: Dashboard
      - button "demo":
        - paragraph: demo
        - img
      - button /Avatar .+@facephi\.com/:
        - img "Avatar"
        - paragraph: /.+@facephi\.com/
        - img
    `);

    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - main:
        - paragraph: Dashboard
        - button "demo":
          - paragraph: demo
          - img
        - button /Avatar .+@facephi\.com/:
          - img "Avatar"
          - paragraph: /.+@facephi\.com/
          - img
        - checkbox /\\d+ hours/
        - checkbox "7 days" [checked]
        - checkbox /\\d+ days/
        - button:
          - img
        - textbox "Filter by date": /\\d+\\/\\d+\\/\\d+ - \\d+\\/\\d+\\/\\d+/
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: "0"
        - paragraph: Authentications
        - img
        - paragraph: "5"
        - paragraph: Onboardings
        - paragraph: All operations (%)
        - paragraph: Succesful
        - paragraph: Started
        - paragraph: Expired
        - paragraph: Cancelled
        - paragraph: Blocked
        - paragraph: Rejected
        - paragraph: Error
        - paragraph: Success rate
        - paragraph
        - paragraph: Error rate
        - paragraph
    `);

    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - alert
      - link:
        - img
      - list:
        - listitem:
          - link "Dashboard":
            - img
            - paragraph: Dashboard
        - listitem:
          - link "Operations":
            - img
            - paragraph: Operations
      - list:
        - img
        - paragraph: Operations
        - button "Application":
          - img
          - paragraph: Application
      - main:
        - paragraph: Dashboard
        - button "demo":
          - paragraph: demo
          - img
        - button /Avatar .+@facephi\.com/:
          - img "Avatar"
          - paragraph: /.+@facephi\.com/
          - img
        - checkbox /\\d+ hours/
        - checkbox "7 days" [checked]
        - checkbox /\\d+ days/
        - button:
          - img
        - textbox "Filter by date": /\\d+\\/\\d+\\/\\d+ - \\d+\\/\\d+\\/\\d+/
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: "0"
        - paragraph: Authentications
        - img
        - paragraph: "5"
        - paragraph: Onboardings
        - paragraph: All operations (%)
        - paragraph: Succesful
        - paragraph: Started
        - paragraph: Expired
        - paragraph: Cancelled
        - paragraph: Blocked
        - paragraph: Rejected
        - paragraph: Error
        - paragraph: Success rate
        - paragraph
        - paragraph: Error rate
        - paragraph
      - region "Notifications alt+T"
    `);

    await expect(page.getByRole('main')).toHaveScreenshot(
      `dashboard-main-content-${browserName}.png`
    );

    await expect(page.locator('body')).toHaveScreenshot(`dashboard-sidebar-${browserName}.png`);
  });
});
