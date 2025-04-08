import { description, test } from 'utils/controller/e2e';

test.beforeEach(async ({ dashboardPage }) => {
  await dashboardPage.loadsURLSkipsTutorial();
});

test.describe('Dashboard validation flows @regression', () => {
  test('Inserts random dates in the dashboard filter and validates via UI and RSC responses ', async ({
    dashboardPage,

    rscHelpers,
  }) => {
    description(
      'This test uses the Filter by date input using random dates and validates the RSC response as well as the UI.'
    );
    rscHelpers.waitForMultipleRSCResponses(1);
    await dashboardPage.validateChartsVisibility();
    await dashboardPage.fillAndValidateRandomDate();
  });

  test('Clicks on the Dashboard buttons filters and validates RSC responses and Echarts in UI', async ({
    dashboardPage,
    rscHelpers,
  }) => {
    description(
      'This test clicks on every checkbox of the Dashboard, validates UI (Echarts), as well as RSC responses.'
    );

    await dashboardPage.clicksHoursButtonAndValidatesRSC(rscHelpers);
    await dashboardPage.validatesUIDashboardResponse();

    await dashboardPage.clicks7DaysButtonAndValidatesRSC(rscHelpers);
    await dashboardPage.validatesUIDashboardResponse();

    await dashboardPage.clicks30DaysButtonAndValidatesRSC(rscHelpers);
    await dashboardPage.validatesUIDashboard30days();
  });

  test('Uses the calendar pop-up and validates all RSC responses and Echarts in UI', async ({
    dashboardPage,
    rscHelpers,
    calendarHelper,
  }) => {
    description(
      'This test clicks randomly on calendar dates, validates UI (Echarts) rednring, as well as RSC responses.'
    );

    await calendarHelper.opensCalendar();
    await calendarHelper.goToPreviousMonth();
    await calendarHelper.selectRandomDateRange();

    await dashboardPage.validateChartsAfterCalendarSelection(rscHelpers);
  });
});
