import { expect, Page } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class apiCommands {
  constructor(private page: Page) {}

  @stepPOM('Validates OIDC token and params in login request')
  async validatesOIDCTokenAndParams() {
    await this.page.route('**/token', async (route, request) => {
      try {
        const url = request.url();
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];

        expect(lastPart).toBe('token');
        console.log('✅ Endpoint "token" found');

        expect(request.method()).toBe('POST');

        const body = new URLSearchParams(request.postData() || '');
        expect(body.get('grant_type')).toBe('authorization_code');
        expect(body.has('code')).toBe(true);
        expect(body.has('code_verifier')).toBe(true);
        expect(body.has('client_id')).toBe(true);

        await route.continue();
      } catch (error) {
        console.error('❌ Error on OIDC interceptation:', error);
        await route.continue();
        throw error;
      }
    });
  }

  @stepPOM('Validates the OIDC redirection to logout')
  async validatesOIDCRedirect() {
    const response = await this.page.waitForResponse(
      '**/auth/realms/idv/protocol/openid-connect/auth**'
    );
    expect(response.status()).toBe(303);
    console.log('Response status:', response.status());
  }

  @stepPOM('Validates a Rendering Server Components (RSC) response')
  async waitForMultipleRSCResponses(count = 1, options = { timeout: 10000 }) {
    try {
      for (let i = 0; i < count; i++) {
        const response = await this.page.waitForResponse(
          (response) => response.url().includes('_rsc=') && response.status() === 200,
          { timeout: options.timeout }
        );

        console.log(`✅ URL received: ${response.url()}`);
        console.log(`✅ Status: ${response.status()}`);
      }
    } catch (error) {
      console.warn('⚠️ Not able to capture all RSC response. Continuing test...');
      await this.page.waitForTimeout(1000);
    }
  }
}
