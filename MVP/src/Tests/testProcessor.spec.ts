import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getLinePercentCoverage, parseJestOutput, showTestMetrics } from '../Processors/testProcessor';
import { getPercentLinesCoverageSpy, parseJestOutputSpy } from '../TestUtils/mocks';
import { mockAllPass, validTestRegex } from '../TestUtils/constants';

describe('Test Processor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should be mocked', () => {
        const pctMock = getPercentLinesCoverageSpy(90);
        const res = getLinePercentCoverage();
        expect(res).toBe(90);
    });
    it('should be mocked 2', () => {
        const parseMock = parseJestOutputSpy(10, 10);
        const res = parseJestOutput();
        expect(res.testsPassed).toBe(10);
    });
});
