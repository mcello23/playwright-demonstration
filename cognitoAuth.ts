import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

console.log('COGNITO_USER_POOL_ID:', COGNITO_USER_POOL_ID);
console.log('COGNITO_CLIENT_ID:', COGNITO_CLIENT_ID);

let userPool = null;

if (COGNITO_USER_POOL_ID && COGNITO_CLIENT_ID) {
  userPool = new CognitoUserPool({
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_CLIENT_ID,
  });
} else {
  console.error('COGNITO_USER_POOL_ID or COGNITO_CLIENT_ID are not defined.');
}

function generateSecretHash(username) {
  if (!COGNITO_CLIENT_SECRET) {
    console.warn('COGNITO_CLIENT_SECRET is not defined. SecretHash will be empty.');
    return '';
  }

  const message = username + COGNITO_CLIENT_ID;
  const hmac = crypto.createHmac('sha256', COGNITO_CLIENT_SECRET);
  hmac.update(message);
  return hmac.digest('base64');
}

export async function getCognitoAuthTokens() {
  return new Promise((resolve, reject) => {
    if (!userPool) {
      reject(new Error('UserPool not initialized. Check environment variables.'));
      return;
    }

    const user = new CognitoUser({ Username: USER_EMAIL, Pool: userPool });

    const secretHash = generateSecretHash(USER_EMAIL);

    const authDetails = new AuthenticationDetails({
      Username: USER_EMAIL,
      Password: USER_PASSWORD,
      SecretHash: secretHash,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const idToken = session.getIdToken().getJwtToken();
        const authState = { idToken };
        fs.writeFileSync('./auth/auth.json', JSON.stringify(authState));
        resolve(idToken);
      },
      onFailure: (err) => {
        console.error('Authentication failed:', err);
        reject(err);
      },
    });
  });
}
