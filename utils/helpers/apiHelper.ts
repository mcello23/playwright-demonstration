import { expect, Page, Response } from '@playwright/test';
import { stepPOM } from 'utils/controller/e2e';

export class apiCommands {
  constructor(private page: Page) {}

  @stepPOM('Validates OIDC token and params in login request')
  async validatesOIDCTokenAndParams() {
    return new Promise(async (resolve) => {
      await this.page.route('**/token', async (route, request) => {
        try {
          const url = request.url();
          const urlParts = url.split('/');
          const lastPart = urlParts[urlParts.length - 1];

          expect(lastPart).toBe('token');

          expect(request.method()).toBe('POST');

          const body = new URLSearchParams(request.postData() || '');
          expect(body.get('grant_type')).toBe('authorization_code');
          expect(body.has('code')).toBe(true);
          expect(body.has('code_verifier')).toBe(true);
          expect(body.has('client_id')).toBe(true);

          // create object with token data
          const tokenData = {
            token: body.get('grant_type'),
            code: body.get('code'),
            codeVerifier: body.get('code_verifier'),
            clientId: body.get('client_id'),
          };

          await route.continue();
          resolve(tokenData);
        } catch (error) {
          console.error('❌ Error on OIDC interceptation:', error);
          await route.continue();
          resolve(null);
          throw error;
        }
      });
    });
  }

  @stepPOM('Validates the OIDC redirection to logout')
  async validatesOIDCRedirect() {
    return new Promise(async (resolve) => {
      try {
        const response = await this.page.waitForResponse(
          '**/auth/realms/idv/protocol/openid-connect/auth**'
        );

        expect(response.status()).toBe(303);
        console.log('✅ Response status:', response.status());

        const headers = response.headers();
        const location = headers['location'];
        console.log('✅ URL redirect found');

        if (!location) {
          throw new Error('Redirection URL not found');
        }

        const redirectUrl = new URL(location);
        console.log('✅ URL parameters:', {
          pathname: redirectUrl.pathname,
          searchParams: Object.fromEntries(redirectUrl.searchParams),
        });

        // Cognito logic
        const logoutData = {
          status: response.status(),
          redirectUrl: location,
          params: {
            sessionCode: redirectUrl.searchParams.get('session_code'),
            clientId: redirectUrl.searchParams.get('client_id'),
            tabId: redirectUrl.searchParams.get('tab_id'),
          },
        };

        // Specific params
        expect(logoutData.params.sessionCode).toBeTruthy();
        expect(logoutData.params.clientId).toBe('spa');
        expect(logoutData.params.tabId).toBeTruthy();

        console.log('✅ OIDC logout redirection successful');
        resolve(logoutData);
      } catch (error) {
        console.error('❌ Error at OIDC redirection:', error);
        resolve(null);
        throw error;
      }
    });
  }

  @stepPOM('Validates a Rendering Server Components (RSC) response')
  async waitForMultipleRSCResponses(count = 1, options = { timeout: 10000 }) {
    interface RSCResponse extends Response {}
    const capturedResponses: RSCResponse[] = [];

    return new Promise((resolve) => {
      const handler = (response: RSCResponse): void => {
        if (response.url().includes('_rsc=') && response.status() === 200) {
          console.log(`✅ RSC URL captured: ${response.url()}`);
          console.log(`✅ Status: ${response.status()}`);
          capturedResponses.push(response);

          if (capturedResponses.length >= count) {
            this.page.removeListener('response', handler);
            resolve(capturedResponses);
          }
        }
      };

      this.page.on('response', handler);

      setTimeout(() => {
        this.page.removeListener('response', handler);
        if (capturedResponses.length < count) {
          console.warn(
            `⚠️ Timeout: Captured only ${capturedResponses.length}/${count} RSC responses`
          );
        }
        resolve(capturedResponses);
      }, options.timeout);
    });
  }
}
