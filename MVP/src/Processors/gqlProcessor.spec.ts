import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { mapGQLResultToRepos } from './gqlProcessor';
import { mockGQLResult, mockRepos, mockValidRepos } from '../TestUtils/constants';

describe('GQL Processor', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    it('Should remove repos that have a null response from GQL', () => {
        const cleanedRepos = mapGQLResultToRepos(mockGQLResult, mockRepos);
        cleanedRepos.forEach((cleanRepo) => {
            const repoInValidRepos = mockValidRepos.find((repo) => repo.fileUrl === cleanRepo.fileUrl);
            if (repoInValidRepos) {
                expect(cleanRepo).toMatchObject(repoInValidRepos);
            }
        });
    });
});
