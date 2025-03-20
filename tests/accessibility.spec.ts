import { description, expect, tags, test } from 'utils/controller/e2e';
// This is an example that will be built upon
// It still doesn't test UX (focus, keyboard navigation, etc.)

test.describe('Accessibility and visual testing of UX in IDV', () => {
  test('Dashboard validation', async ({ page, browserName }) => {
    tags('Accessibility', 'Visual Testing');
    description('This test verifies the Aria content and compares it to UI screenshots.');

    await test.step('Loads IDV main page', async () => {
      await page.waitForURL(/.*tenant.*/);
    });

    await test.step('Validates the Dashboard header and main Aria Snapshot content', async () => {
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
        - button:
          - img
        - textbox "Filter by date"
        - checkbox "24 hours"
        - checkbox "7 days" [checked]
        - checkbox "30 days"
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: /\\d+/
        - paragraph: Authentications
        - img
        - paragraph: /\\d+/
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

      await expect(page.locator('body')).toMatchAriaSnapshot(
        `
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
        - button:
          - img
        - textbox "Filter by date"
        - checkbox "24 hours"
        - checkbox "7 days" [checked]
        - checkbox "30 days"
        - img
        - paragraph: /\\d+/
        - paragraph: New onboardings
        - img
        - paragraph: /\\d+/
        - paragraph: Authentications
        - img
        - paragraph: /\\d+/
        - paragraph: Onboardings
        - paragraph: All operations (%)
        - paragraph: Succesful
        - paragraph: Started
        - paragraph: Expired
      `
      );
    });

    await test.step('Validates the Dashboard main content screenshot', async () => {
      await expect(page.getByRole('main')).toHaveScreenshot(
        `dashboard-main-content-${browserName}.png`
      );
    });

    await test.step('Validates the Dashboard sidebar content screenshot', async () => {
      await expect(page.locator('body')).toHaveScreenshot(`dashboard-sidebar-${browserName}.png`);
    });
  });
});
