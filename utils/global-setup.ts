import { chromium, firefox, FullConfig, Page, webkit } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const requiredEnvVars = ['USER_EMAIL', 'USER_PASSWORD', 'BASE_URL'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`❌ Missing environment variable: ${varName}`);
  }
});

const authDir = path.resolve(__dirname, '../auth');
const unsignedStatePath = path.join(authDir, 'unsigned.json');

// Ensure the authentication directory exists
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

// Function to create an unsigned state (logged-out state)
async function createUnsignedState() {
  if (fs.existsSync(unsignedStatePath)) {
    console.log(`⚙️ Unsigned state already exists, skipping creation.`);
    return;
  }

  console.log('⚙️ Creating unsigned state...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(process.env.BASE_URL!);
    await context.storageState({ path: unsignedStatePath });
    console.log(`✅ Unsigned state saved: ${unsignedStatePath}`);
  } catch (error) {
    console.error(`❌ Failed to create unsigned state:`, error);
  } finally {
    await browser.close();
  }
}

async function attemptLogin(page: Page, browserType: 'chromium' | 'firefox' | 'webkit') {
  // Timeouts maiores para WebKit no CI
  const isCI = process.env.CI === 'true';
  const timeoutOptions = {
    navigationTimeout: browserType === 'webkit' && isCI ? 60000 : 30000,
    actionTimeout: browserType === 'webkit' && isCI ? 60000 : 30000,
  };

  // Número de tentativas maior para WebKit
  const maxRetries = browserType === 'webkit' && isCI ? 3 : 1;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`${browserType}: Tentativa de login ${attempt}/${maxRetries}`);

      // Navegue para a página com timeout maior para WebKit
      await page.goto(process.env.BASE_URL!, {
        timeout: timeoutOptions.navigationTimeout,
        waitUntil: 'networkidle',
      });

      // Esperar pela página carregar completamente
      await page.waitForLoadState('networkidle', { timeout: timeoutOptions.navigationTimeout });
      await page.waitForTimeout(1000); // Pequena espera adicional para estabilidade

      // Email input com timeout aumentado
      const emailInput = page.getByRole('textbox', { name: 'Email address' });
      await emailInput.waitFor({
        state: 'visible',
        timeout: timeoutOptions.actionTimeout,
      });
      await emailInput.fill(process.env.USER_EMAIL!);

      // Aguardar botão "Next" e clicar
      const nextButton = page.getByRole('button', { name: 'Next' });
      await nextButton.waitFor({
        state: 'visible',
        timeout: timeoutOptions.actionTimeout,
      });
      await nextButton.click();

      // Esperar navegação completar
      await page.waitForLoadState('networkidle', { timeout: timeoutOptions.navigationTimeout });
      await page.waitForTimeout(browserType === 'webkit' ? 2000 : 500); // Espera maior para WebKit

      // Password input com timeout aumentado
      const passwordInput = page.getByRole('textbox', { name: 'Password' });
      await passwordInput.waitFor({
        state: 'visible',
        timeout: timeoutOptions.actionTimeout,
      });
      await passwordInput.fill(process.env.USER_PASSWORD!);

      // Botão Continue com timeout aumentado
      const continueButton = page.getByRole('button', { name: 'Continue' });
      await continueButton.waitFor({
        state: 'visible',
        timeout: timeoutOptions.actionTimeout,
      });
      await continueButton.click();

      // Verificar login bem-sucedido
      await page.waitForSelector('[data-test="header-logo"]', {
        timeout: timeoutOptions.navigationTimeout,
      });

      // Login bem-sucedido
      return true;
    } catch (error) {
      console.error(`❌ Tentativa ${attempt} falhou para ${browserType}:`, error);

      if (attempt < maxRetries) {
        console.log(`🔄 Tentando novamente para ${browserType}...`);
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(3000); // Espera entre tentativas
      } else {
        throw error; // Propaga o erro após todas as tentativas
      }
    }
  }
}

// Function to log in and save authentication state
async function loginAndSaveState(browserType: 'chromium' | 'firefox' | 'webkit') {
  const authFilePath = path.join(authDir, `auth-${browserType}.json`);

  // If the auth state already exists, skip login
  if (fs.existsSync(authFilePath)) {
    console.log(`🔄 Authentication state already exists for ${browserType}, skipping login.`);
    return;
  }

  console.log(`🔑 Iniciando login para ${browserType}...`);
  const browserTypeMap = { chromium, firefox, webkit };
  const browserLauncher = browserTypeMap[browserType];

  // Configurações específicas para WebKit no CI
  const launchOptions =
    browserType === 'webkit' && process.env.CI === 'true'
      ? {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : {};

  const browser = await browserLauncher.launch(launchOptions);
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  try {
    // Tentar login com retentativas
    await attemptLogin(page, browserType);

    console.log(`✅ Login successful on ${browserType}, saving authentication state...`);
    await context.storageState({ path: authFilePath });
  } catch (error) {
    console.error(`❌ Failed to log in on ${browserType}:`, error);

    // Em caso de erro no CI com WebKit, crie um arquivo de storage vazio
    // para evitar falhas completas do build
    if (browserType === 'webkit' && process.env.CI === 'true') {
      console.log(`⚠️ Creating empty storage state for ${browserType} to prevent build failure`);
      fs.writeFileSync(
        authFilePath,
        JSON.stringify({
          cookies: [],
          origins: [],
        }),
      );
    }
  } finally {
    await browser.close();
  }
}

// Global setup function
async function globalSetup(config: FullConfig) {
  console.log(`[${new Date().toISOString()}] ⚙️ Running global setup...`);

  // Create unsigned state
  await createUnsignedState();

  // Para CI, execute os navegadores sequencialmente para evitar sobrecarga de recursos
  if (process.env.CI === 'true') {
    console.log('🔧 CI detectado, executando navegadores sequencialmente');
    // Primeiro os mais estáveis
    await loginAndSaveState('chromium');
    await loginAndSaveState('firefox');
    // WebKit por último com mais recursos disponíveis
    await loginAndSaveState('webkit');
  } else {
    // Para desenvolvimento local, executa em paralelo
    await Promise.all([loginAndSaveState('chromium'), loginAndSaveState('firefox'), loginAndSaveState('webkit')]);
  }

  console.log('✅ Global setup completed!');
}

export default globalSetup;
