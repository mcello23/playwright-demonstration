import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import crypto from 'crypto';
import { promises as fs } from 'fs';

const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET, USER_EMAIL, USER_PASSWORD } = process.env;

if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID || !USER_EMAIL || !USER_PASSWORD) {
  throw new Error('Uma ou mais variáveis de ambiente essenciais estão ausentes.');
}

const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID,
});

// Função para gerar o secret hash a partir do username, client ID e client secret
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
    // Passa o secret hash diretamente na propriedade 'SecretHash'
    const authDetails = new AuthenticationDetails({
      Username: USER_EMAIL,
      Password: USER_PASSWORD,
      SecretHash: generateSecretHash(USER_EMAIL),
    });

    user.authenticateUser(authDetails, {
      onSuccess: async (session) => {
        try {
          const idToken = session.getIdToken().getJwtToken();
          const authState = { idToken };
          await fs.writeFile('./auth/auth.json', JSON.stringify(authState));
          resolve(idToken);
        } catch (error) {
          console.error('Erro ao salvar o estado de autenticação:', error);
          reject(error);
        }
      },
      onFailure: (err) => {
        console.error('Falha na autenticação:', err);
        reject(err);
      },
    });
  });
}
