module.exports = {
  rootDir: '../../',
  roots: ['test/jest/specs'],
  moduleDirectories: ['node_modules', 'test/jest/helpers'],
  setupFilesAfterEnv: ['test/jest/setup.js'],
  collectCoverageFrom: ['app/**/*.js'],
  coverageDirectory: 'test/jest/coverage',
  coverageReporters: ['lcov', 'text-summary']
};
