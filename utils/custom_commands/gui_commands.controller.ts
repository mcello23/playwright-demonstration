// import { expect, Page } from '@playwright/test';

// export class loginCommands {
//   page: Page;
//   constructor(page: Page) {
//     this.page = page;
//   }

//   async login() {
//     await this.page.route('**/graphql', async (route, request) => {
//       const postData = JSON.parse(request.postData()!);
//       await route.fulfill({
//         status: 200,
//         contentType: 'application/json',
//       });
//       expect(postData.operationName === 'getAggregateStatistics').toBe(true);
//     });

//     await this.page.goto('/en');
//   }

//   async logout() {
//     await this.page.locator('[data-test="user-name"]').click();
//     await this.page.getByText('Log out').click();
//   }
// }

// class aboutPageCommands {
//   page: Page;
//   constructor(page: Page) {
//     this.page = page;
//   }

//   async navigateToAboutPage() {
//     await this.page.goto('/about');
//   }

//   async verifyAboutTitle() {
//     await expect(this.page).toHaveTitle('About – Practice E-Commerce Site');
//   }
// }

// class cartPageCommands {
//   page: Page;

//   constructor(page: Page) {
//     this.page = page;
//   }

//   async navigateToUploadPage() {
//     await this.page.goto('/cart');
//   }

//   async uploadLogoImage() {
//     const filePath = path.resolve(__dirname, '../../data/logotitle.png');

//     const fileInput = this.page.locator('input[type="file"]');
//     await fileInput.setInputFiles(filePath);

//     await this.page.locator('#upload_1').click();
//   }

//   async verifySuccessLogoUploadMessage() {
//     const successMessage = this.page.locator(
//       '.file_messageblock_fileheader_label',
//     );

//     await expect(successMessage).toContainText(
//       'File logotitle.png uploaded successfully',
//     );
//   }

//   async removeHiddenInputField() {
//     await this.page.evaluate(() => {
//       const selector = document.querySelector('#file_input_button');
//       if (selector) {
//         selector.className = '';
//       }
//     });
//   }

//   async uploadLargePDF() {
//     const filePath = path.join(__dirname, '../../data/3mb-file.pdf');

//     const fileInput = this.page.locator('input[type="file"]');
//     await fileInput.setInputFiles(filePath);

//     await this.page.locator('#upload_1').click();
//   }

//   async verifySuccessPDFUploadMessage() {
//     const successMessage = this.page.locator(
//       '.file_messageblock_fileheader_label',
//     );

//     await expect(successMessage).toContainText(
//       'File 3mb-file.pdf uploaded successfully',
//     );
//   }

//   async verfiySuccessMessageWithConditionalWait() {
//     await this.page
//       .locator('.file_messageblock_fileheader_label')
//       .waitFor({ state: 'visible', timeout: 15000 });
//   }

//   async verfiySuccessMessageWithAssertionWait() {
//     const successMessage = this.page.locator(
//       '.file_messageblock_fileheader_label',
//     );
//     await expect(successMessage).toHaveText(
//       'File 3mb-file.pdf uploaded successfully',
//       { timeout: 7000 },
//     );
//   }
// }

// class blogPageCommands {
//   page: Page;

//   constructor(page: Page) {
//     this.page = page;
//   }

//   async navigateToBlogPage() {
//     await this.page.goto('/blog');
//   }

//   async verifyRecentPostsLenght() {
//     const recentPostsList = this.page.locator('#recent-posts-3 ul li');

//     // Loop trough each list item and verify the length > 10
//     expect(await recentPostsList.count()).toBeLessThan(10);
//     const texts = await recentPostsList.allTextContents();
//     for (const text of texts) {
//       expect(text.trim().length).toBeGreaterThan(12);
//       console.log(text);
//     }

//     // Assert the total lenght = 5
//     expect(await recentPostsList.count()).toEqual(5);
//   }
// }

// class contactPageCommands {
//   page: Page;

//   constructor(page: Page) {
//     this.page = page;
//   }

//   async navigateToContactPage() {
//     await this.page.goto('/contact');
//   }

//   async fillAndSubmitContactForm(
//     name: string,
//     email: string,
//     phone: string,
//     message: string,
//   ) {
//     await this.page.locator('.contact-name input').fill(name);
//     await this.page.locator('.contact-email input').fill(email);
//     await this.page.locator('.contact-phone input').fill(phone);
//     await this.page.locator('.contact-message textarea').fill(message);
//     await this.softAssertSuccessMessage();
//     await this.page.locator('button[type=submit]').click();
//   }

//   async verifySuccessMessage() {
//     // await page
//     //   .getByText(
//     //     "Thanks for contacting us! We will be in touch with you shortly"
//     //   )
//     //   .isVisible();
//     const successMessage = this.page.locator('div[role="alert"]');
//     await expect(successMessage).toHaveText(
//       'Thanks for contacting us! We will be in touch with you shortly',
//     );
//   }

//   async softAssertSuccessMessage() {
//     // add soft assertion // it continues even if it fails this step
//     await expect
//       .soft(this.page.locator('.contact-message textarea'))
//       .toHaveText('');
//     expect(test.info().errors.length).toBeLessThan(2);
//   }
// }
