import { fetchPackageInfo } from '../Requests/Npm/registry';
import { transformToNDJSONRow } from '../Transform/NDJSON';
import { QueryParams, Repository } from '../Types/DataTypes';
import { getOwnerNameFromGithubUrl } from './githubProcessor';

/**
 * John Leidy
 * takes in an npmjs.org url, returns a package if it can be found in the url
 * @param url npmjs.org url
 * @returns returns a package if the url is valid
 */
const extractPackageNameFromUrl = (url: string) => {
    const packageNameMatch = url.match(/\/package\/(.+)/);
    if (!packageNameMatch || packageNameMatch.length < 2) {
        throw new Error('Invalid npm package URL');
    }
    return encodeURIComponent(packageNameMatch[1]);
};

const getRepoUrl = async (npmUrl: string): Promise<string | undefined> => {
    const packageName = extractPackageNameFromUrl(npmUrl);
    const packageInfo = await fetchPackageInfo(packageName);
    if (packageInfo.repository.url) {
        return packageInfo.repository.url;
    }
    return undefined;
};

const getOwnerRepoNameFromNPMUrl = async (npmUrl: string): Promise<QueryParams | undefined> => {
    const repoUrl = await getRepoUrl(npmUrl);
    if (repoUrl) {
        //get the owner and name
        const params = getOwnerNameFromGithubUrl(repoUrl);
        //can return params or undefined
        return params;
    } else {
        //repo url wasn't found
        return undefined;
    }
};

export const processNpmUrl = async <T>(npmUrl: string): Promise<Repository<T> | undefined> => {
    const params = await getOwnerRepoNameFromNPMUrl(npmUrl);
    if (params) {
        return {
            owner: params.owner,
            repoName: params.repoName,
            fileUrl: npmUrl,
            queryResult: null,
            NDJSONRow: transformToNDJSONRow(npmUrl),
        };
    } else {
        return undefined;
    }
};
