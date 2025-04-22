import { faker } from '@faker-js/faker';
import { Page, expect } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class userManagementCommands {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  @stepPOM('Clicks the Test User details')
  async clicksOnTestUser() {
    await this.page.locator('[data-test="next-page"]').click();
    await this.page.locator('[data-test="user-b9896f8d-4e74-4976-84f7-c557e90b273f"]').click();
  }

  @stepPOM('Validates user management page elements')
  async validatesUserManagementAriaSnapshot() {
    await expect(this.page.locator('div').filter({ hasText: 'Personal' }).first())
      .toMatchAriaSnapshot(`
        - img "preview image"
        - paragraph
        - paragraph: Personal information
        - text: Name
        - textbox [disabled]
        - text: Surname
        - textbox [disabled]
        - paragraph: Account settings
        - text: Email
        - img
        - textbox [disabled]
        - button "Recover password"
        - paragraph: Language & timezone
        - text: Language
        - img
        - textbox [disabled]
        - img
        - text: Timezone
        - img
        - textbox [disabled]
        - img
        - paragraph: User management
        - text: Role
        - textbox [disabled]
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

  @stepPOM('Clicks on "Edit" profile button')
  async clicksOnEditButton() {
    await this.page.locator('[data-test="button-edit"]').click();
  }

  @stepPOM('Validates user management page elements when editing')
  async validatesAllInputsAndDropdown() {
    await expect(this.page.locator('[data-test="input-name"]')).toBeEditable();
    await expect(this.page.locator('[data-test="input-lastName"]')).toBeEditable();
    await expect(this.page.locator('[data-test="input-email"]')).toBeEditable();
    await this.page.locator('[data-test="input-container"]').nth(3).click();

    const dropdown = this.page.locator('.facephi-ui-dropdown__list');
    await expect(dropdown).toBeVisible();

    const englishOption = this.page.locator('[data-test="option-en"]');
    await expect(englishOption).toBeVisible();
    await expect(englishOption).toHaveText('English');
    await expect(englishOption).toHaveClass(/isSelected_false/);

    const spanishOption = this.page.locator('[data-test="option-es"]');
    await expect(spanishOption).toBeVisible();
    await expect(spanishOption).toHaveText('Spanish');
    await expect(spanishOption).toHaveClass(/isSelected_true/);

    const portugueseOption = this.page.locator('[data-test="option-pt"]');
    await expect(portugueseOption).toBeVisible();
    await expect(portugueseOption).toHaveText('Portuguese');
    await expect(portugueseOption).toHaveClass(/isSelected_false/);

    await this.page.keyboard.press('Enter');

    await this.page.locator('input[name="timezone"]').click();
    const timezoneOptions = this.page.locator('ul.facephi-ui-dropdown__list button');
    await expect(timezoneOptions).toHaveCount(386);

    await this.page.keyboard.press('Enter');

    await this.page.locator('[data-test="input-container"]').nth(5).click();
    const roleOptions = this.page.locator('ul.facephi-ui-option-menu__list');
    await expect(roleOptions).toContainText('Admin');
    await expect(roleOptions).toContainText('Supervisor');
    await expect(roleOptions).toContainText('Agent');
    await expect(roleOptions).toContainText('Viewer');

    await this.page.keyboard.press('Enter');
  }

  @stepPOM('Edits all unput fields in profile and saves it')
  async editsProfile() {
    let name = faker.person.firstName();
    let lastName = faker.person.lastName();
    await this.page.locator('[data-test="input-name"]').fill(name);
    await this.page.locator('[data-test="input-name"]').focus();
    await expect(this.page.locator('[data-test="input-name"]')).toHaveValue(name);
    await this.page.locator('[data-test="input-lastName"]').fill(lastName);
    await this.page.locator('[data-test="input-lastName"]').focus();
    await expect(this.page.locator('[data-test="input-lastName"]')).toHaveValue(lastName);
    // await this.page.locator('[data-test="input-email"]').fill(faker.internet.email());
    await this.page.locator('[data-test="button-save"]').click();
    await expect(this.page.locator('[data-test="toast-message"]')).toMatchAriaSnapshot(
      `
      - paragraph: User edited
    `
    );
  }

  @stepPOM('Updating image profile')
  async updatesImageProfile(imageFormat: string, imagePath: string) {
    const targetURL =
      'https://idv-suite.identity-platform.dev/en/tenant/idv-demo/user-management/b9896f8d-4e74-4976-84f7-c557e90b273f';

    const fileChooserPromise = this.page.waitForEvent('filechooser');

    let postRequestIntercepted = false;
    await this.page.route(targetURL, async (route, request) => {
      if (request.method() === 'POST') {
        console.log(`${imageFormat} image upload intercepted!`);
        postRequestIntercepted = true;
        const response = await route.fetch();
        expect(response.status()).toBe(200);
        await route.continue();
      } else {
        await route.continue();
      }
    });

    await this.page.locator('[data-test="edit-icon"]').click();

    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(imagePath);

    await expect.poll(() => postRequestIntercepted, { timeout: 10000 }).toBe(true);
    await this.page.locator('[data-test="button-save"]').click();
    await expect(this.page.locator('[data-test="toast-message"]')).toMatchAriaSnapshot(`
      - paragraph: User edited
      `);
  }

  @stepPOM('Clicks on recover password')
  async clicksOnRecoverPassword() {
    await this.page.getByRole('button', { name: 'Recover password' }).click();
  }

  @stepPOM('Validates success toast message of e-mail sent')
  async validatesSuccessToastMessage() {
    const successToast = this.page.locator('[data-test="toast-message"]');
    await expect(successToast).toBeVisible();
    await expect(successToast).toHaveText('Sent email to recover password');
    await expect(this.page.locator('div.facephi-ui-toast__wrapper--type_success')).toBeVisible();
  }
}
