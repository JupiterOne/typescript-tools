module.exports = (api) => {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: api.env('test') ? 'current' : '12',
          },
        },
      ],
      ['@babel/preset-typescript', {}],
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '~': '.',
          },
        },
      ],
    ],
  };
};
