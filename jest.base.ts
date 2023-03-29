import { type Config } from "jest";

const config: Config = {
  verbose: true,
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.(spec)\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleDirectories: ["node_modules"],
  // collectCoverageFrom: ["src/**/*.(t|j)s", "!src/**/*.spec.(t|j)s"],
  // coverageDirectory: "./coverage",
  testEnvironment: "node",
};

export default config;
