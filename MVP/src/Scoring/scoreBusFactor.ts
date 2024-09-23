/**
 * @author Ben Kanter
 * Accepts a repository
 * Clones the repo using isometric git
 * Finds unique contributors
 * Measures the amount of contributions each contributor has
 * Decides which contributors should be part of the bus factor score
 * Utilizes a sigmoid function where the variable is bus factor contributors
 *
 * @param repo - Repository to be scored
 *
 * @return - Bus factor derrived using the Sigmoid function's distribution
 */

import { Repository, NDJSONRow } from '../Types/DataTypes';

export function scoreBusFactor<T>(repo: Repository<T>): number {

    const contributors = new Set();
    if( repo.queryResult?.ref?.target?.history.edges){
        repo.queryResult?.ref?.target?.history.edges.forEach(edge => {
            contributors.add(edge.node.author.name) 
        });
    }

    const contributorCount = contributors.size;
    const maxExpectedContributors = 10; 
    const score = Math.min(1, contributorCount / maxExpectedContributors);
    return score;
}
