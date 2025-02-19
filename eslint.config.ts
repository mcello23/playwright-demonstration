import typescript from '@typescript-eslint/eslint-plugin';
import * as parser from '@typescript-eslint/parser';
import { Linter } from 'eslint';
import playwright from 'eslint-plugin-playwright';
interface ESLintRules extends Linter.RulesRecord {
  'playwright/no-wait-for-timeout': Linter.RuleEntry;
  'playwright/prefer-web-first-assertions': Linter.RuleEntry;
  quotes: ['error' | 'warn' | 'off', 'single' | 'double', { avoidEscape?: boolean }?];
  '@typescript-eslint/no-explicit-any': Linter.RuleEntry;
  '@typescript-eslint/explicit-function-return-type': Linter.RuleEntry;
}

interface ESLintConfig {
  files: string[];
  ignores?: string[];
  languageOptions?: {
    parser: typeof parser;
    parserOptions?: {
      ecmaVersion?: number;
      sourceType?: 'module' | 'script';
      project?: string;
      tsconfigRootDir?: string;
    };
  };
  plugins?: {
    '@typescript-eslint': typeof typescript;
    playwright: typeof playwright;
  };
  rules?: Partial<ESLintRules>;
}

const config: ESLintConfig[] = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      parser: parser as any,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      playwright,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...playwright.configs.recommended.rules,
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/prefer-web-first-assertions': 'warn',
      quotes: ['error', 'single'],
    },
  },
];

export default config;
