/**
 * @author Ben Kanter
 * Accepts a repository
 * Pull number of open and closed issues to obtain score
 * 
 * @param repo - Repository to be scored
 * @returns Score calculated by 1 - (open issues / total issues)
 */

import { Repository, NDJSONRow } from '../Types/DataTypes'

export function scoreCorrectness<T>(repo: Repository<T>): number {
    
    const openIssuesCount = repo.queryResult?.openIssues?.totalCount!;
    const closedIssuesCount = repo.queryResult?.closedIssues?.totalCount!;
    const totalIssuesCount = openIssuesCount + closedIssuesCount;

    console.log(`Open issues: ${openIssuesCount}`);
    console.log(`Closed issues: ${closedIssuesCount}`);
    
    if (closedIssuesCount == 0)
    {
        console.error("No Closed Issues");
        return 0;
    }

    const finalScore = 1 - (openIssuesCount/totalIssuesCount);
    return finalScore;
}