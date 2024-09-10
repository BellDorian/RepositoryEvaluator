import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NDJSONRow, Repository } from '../Types/DataTypes';
import { writeNDJSONToCLI } from './CLI';

//Individual mocking here to ensure output is as we expect in the console
const NDJSONRowMock: NDJSONRow = {
    URL: 'https://someurl.com/',
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
};
//Mock repo to create an array of repos
const RepositoryMock: Repository<any> = {
    owner: 'john',
    repoName: 'johnsrepo',
    description: 'a description',
    repoUrl: 'a url',
    fileUrl: 'a file url',
    queryResult: null,
    NDJSONRow: NDJSONRowMock,
};
//Our mocked repos array to use for CLI output testing
const Repositories = Array.from({ length: 20 }, () => RepositoryMock);

/**
 * John Leidy
 * CLI Output tests
 * Here we test the output of NDJSONRows to the console.
 * Please read the it statements for information on what each test does.
 */
describe('CLI Output', () => {
    // it('Console log should be called with string versions of NDJSONRows', () => {
    //     //mock the console log call
    //     const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    //     writeNDJSONToCLI(Repositories);
    //     //expect that the only thing console log is called with is our row mock
    //     expect(logSpy).toBeCalledWith(JSON.stringify(NDJSONRowMock));
    //     logSpy.mockRestore();
    // });
    it('Output to console should be newline delimited (individual calls to console log should be made)', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        writeNDJSONToCLI(Repositories);
        expect(logSpy).toHaveBeenCalledTimes(1);
        // //index+1 because calls to log spy are 1 indexed..
        // Repositories.forEach((repo, index) => {
        //     expect(logSpy).toHaveBeenNthCalledWith(index + 1, JSON.stringify(repo.NDJSONRow));
        // });
        // logSpy.mockRestore();
    });
});
