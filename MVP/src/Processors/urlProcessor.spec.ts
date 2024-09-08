import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { buildReposFromUrls } from './urlProcessor';
import { fetchPackageInfo } from '../Requests/Npm/registry';
import { mockUrls } from '../TestUtils/constants';

jest.spyOn(global, 'fetch').mockImplementation(
    async (input: string | URL | Request, init?: RequestInit | undefined) => {
        const bodyObj = {
            repository: {
                type: 'some repo',
                url: 'a url',
            },
        };
        const blob = new Blob([JSON.stringify(bodyObj, null, 2)], {
            type: 'application/json',
        });
        return new Response(blob, { status: 200 });
    }
);

/**
 * John Leidy
 * this block tests the urlProcessor. The it statements will explain what this does.
 */
describe('urlProcessor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('Should build an array of repositories from urls', async () => {
        const repos = await buildReposFromUrls(mockUrls);
        repos.forEach((repo) => {
            expect(mockUrls.includes(repo.fileUrl)).toBe(true);
        });
    });

    it('should reach out to the registry if a url includes npmjs or package', async () => {
        const repos = await buildReposFromUrls(mockUrls);
        expect(fetch).toHaveBeenCalledTimes(5);
    });

    it('should throw an error if the response from the npm registry is not ok', async () => {
        //remock fetch... make it return a bad status so response.ok is false... throwing an error
        jest.spyOn(global, 'fetch').mockImplementationOnce(
            async (input: string | URL | Request, init?: RequestInit | undefined) => {
                const bodyObj = {
                    repository: {
                        type: 'some repo',
                        url: 'a url',
                    },
                };
                const blob = new Blob([JSON.stringify(bodyObj, null, 2)], {
                    type: 'application/json',
                });
                return new Response(blob, { status: 404 });
            }
        );
        try {
            const repos = await buildReposFromUrls(mockUrls);
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
        }
    });

    it('should be okay processing invalid urls', async () => {
        const repos = await buildReposFromUrls(['d', 'github.qgdef/fff']);
        repos.forEach((repo) => {
            expect(mockUrls.includes(repo.fileUrl)).toBe(true);
        });
    });
});
