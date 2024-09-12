import { PackageURL } from '../Input/Input';
import { fetchPackageInfo } from '../Requests/Npm/registry';
import { transformToNDJSONRow } from '../Transform/NDJSON';
import { QueryParams, Repository } from '../Types/DataTypes';
import { getOwnerNameFromGithubUrl } from './githubProcessor';

/**
 * John Leidy
 * takes in an npmjs.org url, returns a package if it can be found in the url
 * @param url npmjs.org url
 * @returns string returns a package if the url is valid
 */
const extractPackageNameFromUrl = (url: string): string => {
    const packageNameMatch = url.match(/\/package\/(.+)/);
    if (!packageNameMatch || packageNameMatch.length < 2) {
        throw new Error('Invalid npm package URL');
    }
    return encodeURIComponent(packageNameMatch[1]);
};

/**
 * John Leidy
 * takes in an npm url and returns a github repository url if one was found in the registry for npm
 * @param npmUrl npmjs.org url
 * @returns a github repository url found from the registry
 */
const getRepoUrl = async (npmUrl: string): Promise<string | undefined> => {
    const packageName = extractPackageNameFromUrl(npmUrl);
    const packageInfo = await fetchPackageInfo(packageName);
    if (packageInfo.repository.url) {
        return packageInfo.repository.url;
    }
    return undefined;
};

/**
 * John Leidy
 * takes in an npm url, gets the repo from the registry, creates params, returns them if there was a repo url found, else undefined
 * @param npmUrl npmjs.org url
 * @returns Promise<QueryParams>|undefined
 */
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

/**
 * John Leidy
 * takes in an npm url gets the query params (owner and name) builds a repo if retrieval of params was successful
 * @param npmUrl npmjs.org url
 * @returns Promise<Repository<T>> | undefined
 */
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

/**
 * John Leidy
 * takes in an npm url and returns a github repository url if one was found in the registry for npm
 * @param npmUrl npmjs.org url
 * @returns a github repository url found from the registry
 */
const getRepoUrlN = async (packageName: string): Promise<string | undefined> => {
    const packageInfo = await fetchPackageInfo(packageName);
    if (packageInfo.repository.url) {
        return packageInfo.repository.url;
    }
    return undefined;
};

/**
 * John Leidy
 * takes in an npm url, gets the repo from the registry, creates params, returns them if there was a repo url found, else undefined
 * @param npmUrl npmjs.org url
 * @returns Promise<QueryParams>|undefined
 */
const getOwnerRepoNameFromNPMUrlN = async (packageName: string): Promise<QueryParams | undefined> => {
    const repoUrl = await getRepoUrlN(packageName);
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
export const processNpmUrlN = async <T>(
    npmUrlDataElement: PackageURL
): Promise<Repository<T> | undefined> => {
    if (npmUrlDataElement) {
        if (npmUrlDataElement.packageName) {
            const params = await getOwnerRepoNameFromNPMUrlN(npmUrlDataElement.packageName);
            if (params) {
                return {
                    owner: params.owner,
                    repoName: params.repoName,
                    fileUrl: npmUrlDataElement.raw,
                    queryResult: null,
                    NDJSONRow: transformToNDJSONRow(npmUrlDataElement.raw),
                };
            } else {
                return undefined;
            }
        }
    }
    return undefined;
};
