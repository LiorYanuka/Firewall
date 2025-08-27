const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: { ...tsJestTransformCfg },
  collectCoverageFrom: [
    "src/middleware/**/*.ts",
    "src/routes/universal.route.ts",
    "src/routes/rules.route.ts"
  ],
  coverageThreshold: { global: { statements: 100, lines: 100, functions: 100 } },
  silent: true,
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"]
};