// keycloakAuth.ts
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import qs from 'qs';

dotenv.config();

const tokenEndpoint = process.env.KEYCLOAK_AUTH_URL;
const clientId = process.env.KEYCLOAK_CLIENT_ID;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
const username = process.env.USER_EMAIL;
const password = process.env.USER_PASSWORD;
const grantType = process.env.KEYCLOAK_GRANT_TYPE || 'password'; // Default to password

// Log environment variables to check if they are being loaded correctly
console.log('KEYCLOAK_AUTH_URL:', tokenEndpoint);
console.log('KEYCLOAK_CLIENT_ID:', clientId);
console.log('USER_EMAIL:', username);

export async function authenticateWithKeycloak(): Promise<string> {
  let data: string;

  switch (grantType) {
    case 'password':
      data = qs.stringify({
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
        username: username,
        password: password,
      });
      break;
    case 'client_credentials':
      data = qs.stringify({
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
      });
      break;
    // Adicione outros grant_types conforme necessário
    default:
      throw new Error(`Unsupported grant_type: ${grantType}`);
  }

  try {
    const response = await axios.post(tokenEndpoint, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    const authState = { accessToken: access_token };
    fs.writeFileSync('./auth/auth.json', JSON.stringify(authState));
    return access_token;
  } catch (error: any) {
    console.error('Erro ao autenticar no Keycloak:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', JSON.stringify(error.response.headers));
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error during request setup:', error.message);
    }
    console.error('Verifique se as credenciais e a URL de autenticação estão corretas.');
    throw error;
  }
}
