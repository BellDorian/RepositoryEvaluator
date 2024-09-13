import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { buildReposFromUrls } from './urlProcessor';
import { fetchPackageInfo } from '../Requests/Npm/registry';
import { mockUrls } from '../TestUtils/constants';
import { ProvideURLsForQuerying } from '../Input/Sanitize';

/**
 * John Leidy
 * A global fetch mock for use in the calls when building repos from urls
 */
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
        const exampleFilepath = './src/Input/example_inFile.txt';
        const cleanUrls = ProvideURLsForQuerying(exampleFilepath);
        const repos = await buildReposFromUrls(cleanUrls);
        repos.forEach((repo) => {
            expect(
                cleanUrls.github_URLs.some((url) => url?.raw === repo.fileUrl) ||
                    cleanUrls.npm_URLs.some((url) => url?.raw === repo.fileUrl)
            ).toBe(true);
        });
    });

    it('should reach out to the registry if a url includes npmjs or package', async () => {
        const exampleFilepath = './src/Input/example_inFile.txt';
        const cleanUrls = ProvideURLsForQuerying(exampleFilepath);
        const repos = await buildReposFromUrls(cleanUrls);
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
            const exampleFilepath = './src/Input/example_inFile.txt';
            const cleanUrls = ProvideURLsForQuerying(exampleFilepath);
            const repos = await buildReposFromUrls(cleanUrls);
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
        }
    });

    it('should be okay processing invalid urls', async () => {
        const cleanUrls = ProvideURLsForQuerying('./src/TestUtils/invalidUrls.txt');
        const repos = await buildReposFromUrls(cleanUrls);
        repos.forEach((repo) => {
            expect(mockUrls.includes(repo.fileUrl)).toBe(true);
        });
    });
});
