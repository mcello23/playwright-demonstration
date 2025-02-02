// import { expect, Page, test } from '@playwright/test';
// import path from 'path';

// class homePageCommands {
//   page: Page;
//   constructor(page: Page) {
//     this.page = page;
//   }

//   async navigateToHomePage() {
//     await this.page.goto('/');
//   }

//   async verifyTitle() {
//     await expect(this.page).toHaveTitle(
//       /Practice E-Commerce Site – SDET Unicorns/,
//     );
//   }

//   async clickGetStartedButton() {
//     await expect(this.page).not.toHaveURL(/.*#get-started/);
//     await this.page.locator('#get-started').click();
//   }

//   async verifyGetStartedButton() {
//     await expect(this.page).toHaveURL(/.*#get-started/);
//   }

//   async verifyHeadingText() {
//     const headingText = this.page.locator(
//       "text='Think different. Make different.'",
//     );
//     await expect(headingText).toBeVisible();
//   }

//   async locatesEnabledHomeLink() {
//     const homeLink = this.page.locator("#zak-primary-menu:has-text('Home')");
//     await expect(homeLink).toBeEnabled();
//   }

//   async verifySearchIconXPATH() {
//     const homeText = await this.page.locator(
//       '//*[@id="zak-masthead"]/div/div/div/div[2]/div[1]/div[1]/a',
//     );
//     await expect(homeText).toBeVisible();
//   }

//   async verifyTextOfAllNavLinks() {
//     const expectedLinks = [
//       'Home',
//       'About',
//       'Shop',
//       'Blog',
//       'Contact',
//       'My account',
//     ];
//     const navLinks = this.page.locator('#zak-primary-menu li[id*=menu]');
//     expect(await navLinks.allTextContents()).toEqual(expectedLinks);
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

// export {
//   aboutPageCommands,
//   blogPageCommands,
//   cartPageCommands,
//   contactPageCommands,
//   homePageCommands,
// };
