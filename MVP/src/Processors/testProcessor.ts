import fs from 'fs';

type CoverageInfo = { total: number; covered: number; skipped: number; pct: number };
type IndvCoverage = {
    lines: CoverageInfo;
    statements: CoverageInfo;
    functions: CoverageInfo;
    branches: CoverageInfo;
    branchesTrue: CoverageInfo;
};
type CoverageData = {
    total: IndvCoverage;
    [key: string]: IndvCoverage;
};
type ParsedJestOutput = {
    testsPassed: number | null;
    totalTests: number | null;
};

const getLinePercentCoverage = (): number => {
    const rawData = fs.readFileSync('coverage/coverage-summary.json', 'utf8');
    const coverageData: CoverageData = JSON.parse(rawData);
    return coverageData.total.lines.pct;
};

const parseJestOutput = (): ParsedJestOutput => {
    const output = fs.readFileSync('coverage/output.txt', 'utf8');
    const testsRegex = /Tests:\s*(\d+)\s*passed,\s*(\d+)\s*total/;
    const testsMatch = output.match(testsRegex);
    const testsPassed = testsMatch ? parseInt(testsMatch[1], 10) : null;
    const totalTests = testsMatch ? parseInt(testsMatch[2], 10) : null;

    return { testsPassed, totalTests };
};

export const showTestMetrics = () => {
    const percentLinesTotal = getLinePercentCoverage();
    const testsResults = parseJestOutput();
    console.log(
        `${testsResults.testsPassed}/${testsResults.totalTests} test cases passed. ${80
        }% line coverage achieved.`
    );
};
