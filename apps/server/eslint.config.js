import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules', 'src/generated/prisma'],
    files: ['**/*.{ts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, importPlugin.flatConfigs.recommended, prettier],
    languageOptions: {
      ecmaVersion: 'latest'
    },
    plugins: {},
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' }
      }
    },
    rules: {
      'no-console': 'warn'
    }
  }
];
