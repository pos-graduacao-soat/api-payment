module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  collectCoverage: true,
  coverageReporters: ['text'],
  testPathIgnorePatterns: ['<rootDir>/src/domain/ports/', '<rootDir>/src/domain/errors/', '<rootDir>/src/main/'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/domain/ports/**',
    '!<rootDir>/src/domain/errors/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}