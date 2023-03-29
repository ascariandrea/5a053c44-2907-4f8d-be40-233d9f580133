import { Config } from 'jest';
import baseConfig from './jest.config';

const config: Config = {
  ...baseConfig,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
};

export default config;
