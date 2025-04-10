import { Page } from '@playwright/test';
import { test } from 'utils/controller/e2e';

test.describe('Operations page validation @regression', async () => {
  test.beforeEach(async ({ operationPage, dashboardPage }) => {
    await operationPage.goesToOperationsSkipTutorial(dashboardPage);
  });

  test("Enters any operation and validates it's header elements and format @smoke", async ({
    operationDetailPage,
  }) => {
    await operationDetailPage.entersOperationDetail_Any();
    await operationDetailPage.validatesAllHeaderElements();
  });

  test('Enters a rejected operation and validates all red/unsuccessful elements @smoke', async ({
    operationDetailPage,
  }) => {
    await operationDetailPage.entersOperationDetail_Rejected();
    await operationDetailPage.validatesErrorStatusIcons();
  });

  test('Enters a successful operation and validates all green/successful elements @smoke', async ({
    operationDetailPage,
  }) => {
    await operationDetailPage.entersOperationDetail_Successful();
    await operationDetailPage.validatesSuccessfulStatusIcons();
    await operationDetailPage.validatesTimelineItems();
  });
  const operationSections = [
    {
      name: 'Main',
      navigateFunc: async () => {},
      validationFuncs: [
        'validatesSuccessHeader',
        'validatesSelfieAndDocs',
        'validatesSuccessStrings',
        'validatesIDVerificationSection',
        'validatesCollapsableElements',
      ],
    },
    {
      name: 'OCR',
      navigateFunc: async (page: Page) => await page.getByRole('button', { name: 'OCR' }).click(),
      validationFuncs: ['validatesMainSectionHeadings', 'validatesCollapsableButtons'],
    },
    {
      name: 'Timeline',
      navigateFunc: async (page: Page) =>
        await page.getByRole('button', { name: 'Timeline' }).click(),
      validationFuncs: ['validatesTimelineElements_Successful'],
    },
  ] as const;

  for (const section of operationSections) {
    test(`Validates ${section.name} section in successful operation @functionality`, async ({
      page,
      operationDetailPage,
    }) => {
      await test.step(`Navigate to successful operation and ${section.name} section`, async () => {
        await operationDetailPage.entersOperationDetail_Successful();

        if (section.name !== 'Main') {
          await section.navigateFunc(page);
        }

        if (section.name === 'OCR') {
          await operationDetailPage.entersOCRTab();
        }

        if (section.name === 'Timeline') {
          await operationDetailPage.entersTimelineTab();
        }
      });

      await test.step(`Validate ${section.name} section elements`, async () => {
        for (const validationFunc of section.validationFuncs) {
          await operationDetailPage[validationFunc]();
        }
      });
    });
  }
  test.describe.skip('Validates specific operations based on business requirements', () => {
    test('Validates a successfull operation', async ({ page }) => {
      await page.goto('');
    });

    test('Validates advanced tracking tab inside a operation in Frontend', async ({
      page,
      baseURL,
    }) => {
      await page.goto(
        `${baseURL}/operations/c8b279fd-e6ad-4a66-8d1e-a3a7f2a29ca8?tab=advancedTracking`
      );
    });
  });
});
