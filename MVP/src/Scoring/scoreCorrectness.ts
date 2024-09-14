/**
 * @author Ben Kanter
 * Accepts a repository
 * Pull number of open and closed issues to obtain score
 * 
 * @param repo - Repository to be scored
 * @returns Score calculated by 1 - (open issues / total issues)
 */

import { Repository, NDJSONRow } from '../Types/DataTypes'
/*
General algorithm: 
Pull data using GraphQL to get number of open and closed issues. 
Return the score as total issues divided by the number of closed issues. 
*/
export function scoreCorrectness<T>(repo: Repository<T>): number {
    const CURRENT_DATE = new Date().toISOString(); // current date
    const ONE_YEAR_AGO = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
    const ENDPOINT = "https://api.github.com/graphql";
    const TOKEN = process.env.GITHUB_TOKEN;
    const query = `
    {
        repository(owner: "${repo.owner}", name: "${repo.repoName}") {
            openIssues: issues(states: OPEN) {
                totalCount
            }
            closedIssues: issues(states: CLOSED) {
                totalCount
            }
        }
    }
    `;
    let openIssuesCount = 0;
    let closedIssuesCount = 0;
    fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    })
    .then((res) => res.json())
    .then((data) => {
    openIssuesCount = data.data.repository.openIssues.totalCount;
    closedIssuesCount = data.data.repository.closedIssues.totalCount;

    console.log(`Open issues: ${openIssuesCount}`);
    console.log(`Closed issues: ${closedIssuesCount}`);
  })
  .catch((error) => console.error('Error:', error));
    return (openIssuesCount+closedIssuesCount)/closedIssuesCount;
}