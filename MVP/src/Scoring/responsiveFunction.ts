import { Repository } from '../Types/DataTypes';

/**
 * Tim Carpenter
 *
 * Evaluates the responsiveness score of a repository as a ratio of open and closed issues
 *
 * @template T - The type of the data stored in the repository (generic)
 * @param {Repository<T>} repo - The repository to be evaluated
 * @returns 0-1 - Score between 0 and 1
 *
 */
export function responsiveFunction<T>(repo: Repository<T>): number {
    var score = 0;

    try {
        const open = repo.queryResult?.openIssues?.totalCount!;
        const closed = repo.queryResult?.closedIssues?.totalCount!;

        score = 1 - open / closed;
    } catch (error) {
        console.error('Error finding issues on repository');
        return score;
    }

    return score;
}
