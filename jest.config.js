module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text'],
  coverageDirectory: '<rootDir>/coverage',
  testPathIgnorePatterns: [
    '<rootDir>/src/domain/ports/', 
    '<rootDir>/src/domain/errors/', 
    '<rootDir>/src/main/',
    '<rootDir>/src/presentation/gateway/errors/',
    '<rootDir>/src/.*\\index\\.ts',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/domain/ports/**',
    '!<rootDir>/src/domain/errors/**',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/presentation/gateway/errors/**',
    '!<rootDir>/**/index.ts',
    '!<rootDir>/src/.*\\index\\.ts'
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