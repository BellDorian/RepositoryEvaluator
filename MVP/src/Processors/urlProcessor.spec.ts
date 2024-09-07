import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { buildReposFromUrls } from './urlProcessor';
import { NPMRegistryResponse } from '../Types/ResponseTypes';
import { fetchPackageInfo } from '../Requests/Npm/registry';

const urls = [
    'https://github.com/Cinnamon/kotaemon',
    'https://github.com/Z4nzu/hackingtool',
    'https://github.com/mendableai/firecrawl',
    'https://github.com/cemu-project/Cemu',
    'https://github.com/dokku/dokku',
    'https://github.com/x/someunkonwrepo',
    'https://www.npmjs.com/package/react',
    'https://www.npmjs.com/package/@google-cloud/firestore',
    'https://www.npmjs.com/package/@launchdarkly/node-server-sdk',
    'https://www.npmjs.com/package/@digest/eslint-config-typescript',
    'https://www.npmjs.com/package/@applicaster/zapp-react-native-bridge',
];

const expectedRepos = [
    {
        owner: 'Cinnamon',
        repoName: 'kotaemon',
        fileUrl: 'https://github.com/Cinnamon/kotaemon',
        queryResult: null,
        NDJSONRow: {
            URL: 'https://github.com/Cinnamon/kotaemon',
            NetScore: 0,
            NetScore_Latency: 0,
            RampUp: 0,
            RampUp_Latency: 0,
            Correctness: 0,
            Correctness_Latency: 0,
            BusFactor: 0,
            BusFactor_Latency: 0,
            ResponsiveMaintainer: 0,
            ResponsiveMaintainer_Latency: 0,
            License: 0,
            License_Latency: 0,
        },
    },
    {
        owner: 'Z4nzu',
        repoName: 'hackingtool',
        fileUrl: 'https://github.com/Z4nzu/hackingtool',
        queryResult: null,
        NDJSONRow: {
            URL: 'https://github.com/Z4nzu/hackingtool',
            NetScore: 0,
            NetScore_Latency: 0,
            RampUp: 0,
            RampUp_Latency: 0,
            Correctness: 0,
            Correctness_Latency: 0,
            BusFactor: 0,
            BusFactor_Latency: 0,
            ResponsiveMaintainer: 0,
            ResponsiveMaintainer_Latency: 0,
            License: 0,
            License_Latency: 0,
        },
    },
    {
        owner: 'mendableai',
        repoName: 'firecrawl',
        fileUrl: 'https://github.com/mendableai/firecrawl',
        queryResult: null,
        NDJSONRow: {
            URL: 'https://github.com/mendableai/firecrawl',
            NetScore: 0,
            NetScore_Latency: 0,
            RampUp: 0,
            RampUp_Latency: 0,
            Correctness: 0,
            Correctness_Latency: 0,
            BusFactor: 0,
            BusFactor_Latency: 0,
            ResponsiveMaintainer: 0,
            ResponsiveMaintainer_Latency: 0,
            License: 0,
            License_Latency: 0,
        },
    },
    {
        owner: 'cemu-project',
        repoName: 'Cemu',
        fileUrl: 'https://github.com/cemu-project/Cemu',
        queryResult: null,
        NDJSONRow: {
            URL: 'https://github.com/cemu-project/Cemu',
            NetScore: 0,
            NetScore_Latency: 0,
            RampUp: 0,
            RampUp_Latency: 0,
            Correctness: 0,
            Correctness_Latency: 0,
            BusFactor: 0,
            BusFactor_Latency: 0,
            ResponsiveMaintainer: 0,
            ResponsiveMaintainer_Latency: 0,
            License: 0,
            License_Latency: 0,
        },
    },
    {
        owner: 'dokku',
        repoName: 'dokku',
        fileUrl: 'https://github.com/dokku/dokku',
        queryResult: null,
        NDJSONRow: {
            URL: 'https://github.com/dokku/dokku',
            NetScore: 0,
            NetScore_Latency: 0,
            RampUp: 0,
            RampUp_Latency: 0,
            Correctness: 0,
            Correctness_Latency: 0,
            BusFactor: 0,
            BusFactor_Latency: 0,
            ResponsiveMaintainer: 0,
            ResponsiveMaintainer_Latency: 0,
            License: 0,
            License_Latency: 0,
        },
    },
    {
        owner: 'x',
        repoName: 'someunkonwrepo',
        fileUrl: 'https://github.com/x/someunkonwrepo',
        queryResult: null,
        NDJSONRow: {
            URL: 'https://github.com/x/someunkonwrepo',
            NetScore: 0,
            NetScore_Latency: 0,
            RampUp: 0,
            RampUp_Latency: 0,
            Correctness: 0,
            Correctness_Latency: 0,
            BusFactor: 0,
            BusFactor_Latency: 0,
            ResponsiveMaintainer: 0,
            ResponsiveMaintainer_Latency: 0,
            License: 0,
            License_Latency: 0,
        },
    },
];

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
        const repos = await buildReposFromUrls(urls);
        repos.forEach((repo) => {
            expect(urls.includes(repo.fileUrl)).toBe(true);
        });
    });

    it('should reach out to the registry if a url includes npmjs or package', async () => {
        const repos = await buildReposFromUrls(urls);
        expect(fetchPackageInfo).toHaveBeenCalledTimes(5);
    });
});
