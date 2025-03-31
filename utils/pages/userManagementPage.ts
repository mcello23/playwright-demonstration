import { Page, expect } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class userManagementCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Clicks on a user from the list')
  async clicksOnUser() {
    await this.page.locator('[data-test="user-b9896f8d-4e74-4976-84f7-c557e90b273f"]').click();
    await expect(this.page.locator('div').filter({ hasText: 'Personal' }).nth(1))
      .toMatchAriaSnapshot(`
        - img "preview image"
        - paragraph
        - paragraph: Personal information
        - text: Name
        - textbox [disabled]: Testing
        - text: Surname
        - textbox [disabled]: IDV
        - paragraph: Account settings
        - text: Email
        - img
        - textbox [disabled]: testing-idv@facephi.com
        - button "Recover password"
        - paragraph: Language & timezone
        - text: Language
        - img
        - textbox [disabled]: Spanish
        - img
        - text: Timezone
        - img
        - textbox [disabled]: Europe/Madrid
        - img
        - paragraph: User management
        - text: Role
        - textbox [disabled]: Admin
        - img
        - button "Edit"
        - paragraph: Roles
        - img
        - paragraph: Admin
        - paragraph: Has full control over the platform, including all modules, configuration and user management. This role cannot be deleted or modified.
        - img
        - paragraph: Supervisor
        - paragraph: Can manage operations and identities, monitor workflows and review fraud cases. This role cannot change configuration or integrations.
        - img
        - paragraph: Agent
        - paragraph: Has access to operations and identities to manage cases. This role cannot modify configuration or integrations.
        - img
        - paragraph: Viewer
        - paragraph: Has read-only access to operations, workflows (list view), and identities. This role cannot modify any data, configuration, or integrations.
      `);
  }
}
