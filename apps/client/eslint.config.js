// eslint.config.js
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['node_modules'],
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.flat.recommended,
    importPlugin.flatConfigs.recommended,
    jsxA11y.flatConfigs.recommended,
    prettier
  ],
  languageOptions: {
    ecmaVersion: 'latest'
  },
  plugins: {
    'react-hooks': reactHooks
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: { project: './tsconfig.json' }
    }
  },
  rules: {
    'no-console': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off'
  }
});
