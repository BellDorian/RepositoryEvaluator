module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,}"], 
  testPathIgnorePatterns: ['dist'],
  reporters:[
    'default',
    './dist/TestUtils/customReporter.js'
  ],
  coverageReporters:['text','json-summary'],
};