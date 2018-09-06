module.exports = {
  setupFiles: [],

  transform: {'^.+\\.js$': 'babel-jest'},
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/'
  ],

  testMatch: ['<rootDir>/src/**/*.test.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/'
  ],

  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/build/'
  ],

  timers: 'fake',
  clearMocks: true,
  resetMocks: false,

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: './build/cov',
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
