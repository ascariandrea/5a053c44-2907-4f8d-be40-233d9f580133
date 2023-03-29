import { type Config } from "jest";
import jestBase from "./jest.base";

const config: Config = {
  ...jestBase,
  projects: ["<rootDir>/services/backend"],
  // collectCoverageFrom: [
  //   "services/**/src/**/*.(t|j)s",
  //   "!services/**/src/**/*.spec.(t|j)s",
  // ],
  coverageDirectory: "./coverage",
};

export default config;
