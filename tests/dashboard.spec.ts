import { description, tags, test } from '../utils/controller/e2e';

test.describe('Dashboard validation flows @regression', () => {
  test('Inserts random dates in the dashboard filter and validates via UI', async ({
    dashboardPage,
    apiHelpers,
  }) => {
    description(
      'This test uses the Filter by date input using random dates and validates the RSC response as well as the UI.'
    );

    await apiHelpers.waitForMultipleRSCResponses(2);
    const formattedDate = await dashboardPage.fillDateInputWithRandomDate();
    await dashboardPage.validateChartsVisibility();
    await dashboardPage.validateDateRangeFilter(formattedDate);
  });

  test('Clicks on the Dashboard buttons filters and validates RSC request and Echarts in UI', async ({
    dashboardPage,
    apiHelpers,
  }) => {
    description(
      'This test clicks on every checkbox of the Dashboard, validates UI (Echarts response), as well as RSC responses.'
    );

    await dashboardPage.selectHoursFilterAndValidate(apiHelpers);
    await dashboardPage.selectSevenDaysFilterAndValidate(apiHelpers);
    await dashboardPage.selectThirtyDaysFilterAndValidate(apiHelpers);
  });

  test('Uses the calendar pop-up and validates all RSC requests and Echarts in UI', async ({
    dashboardPage,
    apiHelpers,
    calendarHelper,
  }) => {
    tags('Calendar', 'Echarts', 'Date picker');
    description(
      'This test clicks randomly on calendar dates, validates UI (Echarts response), as well as RSC responses.'
    );

    await calendarHelper.opensCalendar();
    await calendarHelper.goToPreviousMonth();
    await calendarHelper.selectRandomDateRange();
    await dashboardPage.validateChartsAfterCalendarSelection(apiHelpers);
  });
});
