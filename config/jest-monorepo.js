module.exports = {
  ...require('./jest-base'),
  testMatch: ['<rootDir>/packages/*/{src,test}/**/*.test.{ts,tsx}'],
  projects: ['<rootDir>/packages/*'],
};
