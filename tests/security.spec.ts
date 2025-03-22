import { description, expect, test } from 'utils/controller/e2e';

test.describe('Security validation for environment variables @regression', () => {
  test.skip('Verifies sensitive environment variables are not exposed in the DOM after login', async ({
    page,
  }) => {
    description(
      'This test ensures that sensitive environment variables are not visible in the DOM after login'
    );
    const pageContent = await page.content();
    const sensitiveStrings = ['NEXT_PUBLIC_API_URL', 'https://v3.identity-platform.dev/graphql'];

    for (const sensitiveString of sensitiveStrings) {
      expect(pageContent).not.toContain(sensitiveString);
    }
  });
});
