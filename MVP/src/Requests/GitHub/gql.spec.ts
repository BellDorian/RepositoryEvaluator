import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { requestFromGQL } from './gql';

/**
 * John Leidy
 * General fetch spy and mock. This is used to prevent actual network calls being performed during unit testing.
 */
jest.spyOn(global, 'fetch').mockImplementation(
    async (input: string | URL | Request, init?: RequestInit | undefined) => {
        //the mock body fetch will return when called
        const bodyObj = {
            repository: {
                type: 'some repo',
                url: 'a url',
            },
        };
        //a magical blob (it's immutable raw data)
        const blob = new Blob([JSON.stringify(bodyObj, null, 2)], {
            type: 'application/json',
        });
        //the mock response object fetch will return when called
        return new Response(blob, { status: 200 });
    }
);

/**
 * John Leidy
 * This block is responsible for testing the request we send to the GitHub GQL api.
 */
describe('Gql Request', () => {
    beforeEach(() => {
        //keep console errors out of the test output.
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should throw an error without a proper .evn alongside proper env variables', async () => {
        //set them to an incorrect value
        process.env.GITHUB_API_URL = undefined;
        process.env.GITHUB_PAT = undefined;
        try {
            await requestFromGQL('');
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            if (err instanceof Error) {
                expect(err.message).toBe(
                    'env not properly configured, please create a .env file in MVP/ with... GITHUB_PAT (will change) and GITHUB_API_URL'
                );
            }
        }
    });

    it('should return undefined if a request error occurs', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(
            async (input: string | URL | Request, init?: RequestInit | undefined) => {
                //mocking a request error
                throw new Error('mock error');
            }
        );
        const res = await requestFromGQL('');
        expect(res).toBe(undefined);
    });
});
