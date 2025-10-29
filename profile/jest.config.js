// jest.config.js - replace your current config
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': ['ts-jest', {
        useESM: false,
      }],
    },
    testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  };