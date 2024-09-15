import { CleanURLSet } from '../Types/URLTypes';
import { Repository } from '../Types/DataTypes';
import { processGitHubUrl } from './githubProcessor';
import { processNpmUrl } from './registryProcessor';

/**
 * @author John Leidy
 * Takes in CleanUrlSet, returns generic repositories array
 * @param cleanUrls -  {@type CleanUrlSet} the query params and urls from files.
 * @returns repositories - {@type Repository<T>} where T is the type to extend the base query result with.
 */
export const buildReposFromUrls = async <T>(cleanUrls: CleanURLSet): Promise<Repository<T>[]> => {
    let repositories: Repository<T>[] = [];
    //Since the data is now split into separate types that do not have a consistent structure... process in two loops.
    for (const npmUrlDataElement of cleanUrls.npm_URLs) {
        const repo = await processNpmUrl<T>(npmUrlDataElement);
        if (repo) {
            repositories.push(repo);
        }
    }

    for (const gitUrlDataElement of cleanUrls.github_URLs) {
        const repo = await processGitHubUrl<T>(gitUrlDataElement);
        if (repo) {
            repositories.push(repo);
        }
    }

    return repositories;
};
