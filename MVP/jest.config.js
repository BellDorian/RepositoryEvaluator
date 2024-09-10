module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,}"], 
  coverageReporters:['json-summary'],
  testPathIgnorePatterns: ['./dist/']
};