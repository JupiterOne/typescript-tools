import { createConfig } from '@jupiterone/eslint-config/flat';

export default createConfig({
  tsconfigRootDir: import.meta.dirname,
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
