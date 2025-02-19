import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import crypto from 'crypto';
import fs from 'fs';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID ?? '';
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID ?? '';
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET ?? '';
const USER_EMAIL = process.env.USER_EMAIL ?? '';
const USER_PASSWORD = process.env.USER_PASSWORD ?? '';

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID,
});

function generateSecretHash(username: string): string {
  if (!COGNITO_CLIENT_SECRET) return '';

  return crypto
    .createHmac('sha256', COGNITO_CLIENT_SECRET)
    .update(username + COGNITO_CLIENT_ID)
    .digest('base64');
}

export async function getCognitoAuthTokens(): Promise<string> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: USER_EMAIL, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: USER_EMAIL,
      Password: USER_PASSWORD,
      ClientMetadata: {
        SECRET_HASH: generateSecretHash(USER_EMAIL),
      },
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const authState = { idToken };
        fs.writeFileSync('./auth/auth.json', JSON.stringify(authState));
        resolve(idToken);
      },
      onFailure: (err) => reject(err),
    });
  });
}
