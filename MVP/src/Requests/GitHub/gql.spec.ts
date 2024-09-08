import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { requestFromGQL } from './gql';

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

describe('Gql Request', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should throw an error without env variables', async () => {
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

    it('should throw return undefined if a request error occurs', async () => {
        jest.spyOn(global, 'fetch').mockImplementation(
            async (input: string | URL | Request, init?: RequestInit | undefined) => {
                throw new Error('mock error');
            }
        );
        try {
            await requestFromGQL('');
        } catch (err) {
            expect(err).toBeInstanceOf(Error);
            if (err instanceof Error) {
                expect(err.message).toBe('mock error');
            }
        }
    });
});
