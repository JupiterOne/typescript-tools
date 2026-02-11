import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConfig } from '@jupiterone/eslint-config/flat';

export default createConfig({
  tsconfigRootDir: import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)),
  additionalConfigs: [
    {
      ignores: [
        '*.js',
        '*.mjs',
        'index.js',
        'config/**',
        'test/fixtures/**/*',
      ],
    },
  ],
});
