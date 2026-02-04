import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

const reactRefreshRules = reactRefresh.configs?.vite?.rules ?? reactRefresh.configs?.recommended?.rules ?? {};

export default [
  { ignores: ['dist/**'] },

  // Base recommended rules for all JS/JSX.
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },

  // Browser/React app code.
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      ...reactRefreshRules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },

  // Node-based tooling (Vite config, scripts, lint config itself).
  {
    files: ['eslint.config.js', 'vite.config.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
];
