import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // Global ignores (replaces .eslintignore and ignorePatterns)
  {
    ignores: [
      '*.js',
      '!eslint.config.js',
      'index.js',
      'config/**',
      'test/fixtures/**/*',
      'dist/**',
      'node_modules/**',
    ],
  },

  // Use FlatCompat to bridge the legacy @jupiterone/eslint-config
  ...compat.extends('@jupiterone/eslint-config/node18'),

  // TypeScript-specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
