import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { configs, parser } from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
// @ts-expect-error ignore type errors
import pluginPromise from 'eslint-plugin-promise';

import { includeIgnoreFile } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '../.gitignore');

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  globalIgnores(['dist']),
  pluginPromise.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylistic,
    },
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      js.configs.recommended,
      configs.recommended,
      configs.strict,
      configs.stylistic,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      sourceType: 'module',
      parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import/resolver': {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        'typescript': true,
        'node': true,
      },
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
);
