import { describe, expect, it, jest } from '@jest/globals';
import { scoreRepositoriesArray, scoreRepository } from '../Scoring/scoring';
import { mockValidRepos } from '../TestUtils/constants';
import { getLicenseFuncSpy, getResponsiveFuncSpy } from '../TestUtils/mocks';
import { beforeEach } from 'node:test';

describe('Scoring', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it('Should return a scored repository', () => {
        const licenseFuncSpy = getLicenseFuncSpy(1);
        const responsiveFuncSpy = getResponsiveFuncSpy(1);
        const repo = scoreRepository(mockValidRepos[0]);
        expect(repo.NDJSONRow.License).toBe(1);
        expect(repo.NDJSONRow.ResponsiveMaintainer).toBe(1);
        expect(licenseFuncSpy).toBeCalled();
        expect(responsiveFuncSpy).toBeCalled();
    });
    it('Should return an array of scored repositories', () => {
        const licenseFuncSpy = getLicenseFuncSpy(1);
        const responsiveFuncSpy = getResponsiveFuncSpy(1);
        const repos = scoreRepositoriesArray(mockValidRepos);
        repos.forEach((repo) => {
            expect(repo.NDJSONRow.License).toBe(1);
            expect(repo.NDJSONRow.ResponsiveMaintainer).toBe(1);
        });

        expect(licenseFuncSpy).toBeCalled();
        expect(responsiveFuncSpy).toBeCalled();
    });
});
