import chalk from 'chalk';
import { transformToNDJSONRow } from '../Transform/NDJSON';
import { QueryParams, Repository } from '../Types/DataTypes';

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
