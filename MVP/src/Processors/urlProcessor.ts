import { Repository } from '../Types/DataTypes';
import { processGitHubUrl } from './githubProcessor';
import { processNpmUrl } from './registryProcessor';
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
