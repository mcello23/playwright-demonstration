import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import * as tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  playwright.configs.flat,
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'allure-results/**',
      'allure-report/**',
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      playwright: playwright.plugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Playwright rules
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/prefer-web-first-assertions': 'warn',
      'playwright/no-force-option': 'error',
      'playwright/no-conditional-in-test': 'warn',
      'playwright/valid-expect': ['error', { assertFunctionNames: ['expect', 'expectLoaded'] }],

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',

      // Formatting
      quotes: ['error', 'single', { avoidEscape: true }],
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          printWidth: 100,
          semi: true,
          trailingComma: 'es5',
          tabWidth: 2,
        },
      ],
    },
  },
  // Test specific rules
  {
    files: ['**/tests/**/*.{ts,tsx}', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'playwright/expect-expect': 'error',
    },
  }
);
