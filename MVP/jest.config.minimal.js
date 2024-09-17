module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts,}"], 
    testPathIgnorePatterns: ['dist'],
    silent: true,
    reporters:[
        './dist/TestUtils/customReporter.js'
      ],
      coverageReporters:['json-summary'],
      setupFilesAfterEnv: ["./jest.setup.js"],
  };
  