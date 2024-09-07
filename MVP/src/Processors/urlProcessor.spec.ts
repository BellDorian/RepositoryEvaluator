import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { buildReposFromUrls } from './urlProcessor';
import { NPMRegistryResponse } from '../Types/ResponseTypes';
import { fetchPackageInfo } from '../Requests/Npm/registry';
import { mockUrls } from '../TestUtils/constants';

jest.mock<{ fetchPackageInfo: (packageName: string) => Promise<NPMRegistryResponse> }>(
    '../Requests/Npm/registry',
    () => ({
        fetchPackageInfo: jest.fn(
            async (packageName: string): Promise<NPMRegistryResponse> => ({
                repository: { type: 'none', url: `https://github.com/${packageName}` },
            })
        ),
    })
);

describe('urlProcessor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('Should build an array of repositories from urls', async () => {
        const repos = await buildReposFromUrls(mockUrls);
        repos.forEach((repo) => {
            expect(mockUrls.includes(repo.fileUrl)).toBe(true);
        });
    });

    it('should reach out to the registry if a url includes npmjs or package', async () => {
        const repos = await buildReposFromUrls(mockUrls);
        expect(fetchPackageInfo).toHaveBeenCalledTimes(5);
    });
});
