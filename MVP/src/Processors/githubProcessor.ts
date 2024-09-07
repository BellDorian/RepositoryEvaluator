import chalk from 'chalk';
import { transformToNDJSONRow } from '../Transform/NDJSON';
import { QueryParams, Repository } from '../Types/DataTypes';

/**
 * John Leidy
 * takes in github url, returns QueryParams if the owner and name can be extracted using match
 * @param url any github url, including those that come back from registry with and without ssh
 * @returns QueryParams | undefined
 */
export const getOwnerNameFromGithubUrl = (url: string): QueryParams | undefined => {
    //regex to pull the owner and repo name.
    //complex because npm urls can be ssh or http urls
    const regex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/;

    const match = url.match(regex);

    if (match) {
        const owner = match[1];
        const repoName = match[2];

        return { owner: owner, repoName: repoName };
    } else {
        console.log(chalk.red('Invalid GitHub URL'));
        console.log(url);
        return undefined;
    }
};

/**
 * John Leidy
 * takes in a github url, attempts to get the owner and repo name from that url, returns a created repository if owner and repo name could be obtained.
 * @param url takes in a github.com url
 * @returns a repository with proper fielsd initialized
 */
export const processGitHubUrl = <T>(url: string): Repository<T> | undefined => {
    const params = getOwnerNameFromGithubUrl(url);
    if (params) {
        return {
            owner: params.owner,
            repoName: params.repoName,
            fileUrl: url,
            queryResult: null,
            NDJSONRow: transformToNDJSONRow(url),
        };
    } else {
        return undefined;
    }
};
