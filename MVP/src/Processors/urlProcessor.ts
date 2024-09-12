import { CleanURLSet, PackageURL, RepoURL } from '../Input/Input';
import { Repository } from '../Types/DataTypes';
import { processGitHubUrl, processGitHubUrlN } from './githubProcessor';
import { processNpmUrl, processNpmUrlN } from './registryProcessor';

/**
 * John Leidy
 * takes urls in, processes both npm and github urls, returns repositories.
 * @param urls
 * @returns repositories
 */
export const buildReposFromUrls = async <T>(urls: string[]): Promise<Repository<T>[]> => {
    let repositories: Repository<T>[] = [];
    for (const url of urls) {
        if (url.includes('package') && url.includes('npmjs')) {
            const repo = await processNpmUrl<T>(url);
            if (repo) {
                repositories.push(repo);
            }
        } else if (url.includes('github')) {
            const repo = processGitHubUrl<T>(url);
            if (repo) {
                repositories.push(repo);
            }
        }
    }
    return repositories;
};

export const buildReposFromUrlsN = async <T>(
    githubUrlData: RepoURL[],
    npmUrlData: PackageURL[]
): Promise<Repository<T>[]> => {
    let repositories: Repository<T>[] = [];
    //Since the data is now split into separate types that do not have a consistent structure... process in two loops.
    for (const npmUrlDataElement of npmUrlData) {
        const repo = await processNpmUrlN<T>(npmUrlDataElement);
        if (repo) {
            repositories.push(repo);
        }
    }

    for (const gitUrlDataElement of githubUrlData) {
        const repo = await processGitHubUrlN<T>(gitUrlDataElement);
        if (repo) {
            repositories.push(repo);
        }
    }

    return repositories;
};
