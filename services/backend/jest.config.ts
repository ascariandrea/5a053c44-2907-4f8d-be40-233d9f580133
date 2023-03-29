import { type Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { compilerOptions } = require('./tsconfig.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jestBaseConfig = require('../../jest.base');

// const paths = pathsToModuleNameMapper(compilerOptions.paths, {
//   prefix: '<rootDir>/src/',
// });

const config: Config = {
  ...jestBaseConfig.default,
  displayName: 'backend',
  rootDir: __dirname,
  moduleFileExtensions: ['js', 'json', 'ts'],
  // moduleNameMapper: {
  //   ...paths,
  // },
  // modulePaths: [compilerOptions.baseUrl],
  testRegex: '.*\\.(spec|e2e)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist',
    '<rootDir>/test',
  ],
  collectCoverageFrom: ['**/*.{js,ts}', '!**/*.spec.{js,ts}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
