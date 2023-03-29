import { type Config } from 'jest';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jestBaseConfig = require('../../jest.base');

const config: Config = {
  ...jestBaseConfig.default,
  displayName: 'backend',
  rootDir: __dirname,
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.(spec|e2e)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist',
    '<rootDir>/test',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/migrations/**',
    '!**/*.spec.{js,ts}',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
