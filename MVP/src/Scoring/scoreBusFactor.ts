/**
 * @author Ben Kanter
 * Accepts a repository
 * Clones the repo using isometric git
 * Finds unique contributors 
 * Measures the amount of contributions each contributor has
 * Returns score based on that. 
 * 
 * @param repo - Repository to be scored
 */

import { Repository, NDJSONRow } from '../Types/DataTypes'
/*
General algorithm: 
Pull the repository. Get the amount of maintainers
Each maintainer from the last year with more than 10 commits to the project adds a point to the score
Top 10% commit users give 5 points 

*/
const git = require('isomorphic-git');
const fileSystem = require('fs');
const http = require('isomorphic-git/http/node');


function removeRepo(directory: string) {
    if (fileSystem.existsSync(directory)) {
      // Recursively remove all files and subdirectories
      fileSystem.rmSync(directory, { recursive: true, force: true });
      console.log(`Repository at ${directory} has been removed.`);
    } else {
      console.log(`Directory ${directory} does not exist.`);
    }
}
export function scoreBusFactor<T>(repo: Repository<T>, ): number {
    
    const repoDirectory = `./${repo.repoName}`
    git.clone({
        fileSystem, http, singleBranch: true, dir: `./${repoDirectory}`, url: repo.fileUrl
    }); // Clones repo
    
    const gitLog = git.log({
        fileSystem,
        dir: repoDirectory,
        depth: 100,
    })
    const contributors: string[] = [];
    gitLog.forEach((commit: any) => {
        const commitAuthor: string = commit.commit.author.name;
        contributors.push(commitAuthor);
    });
    type Contributor = {
        name: string;
        commits: number;
    }
    let uniqueContributors: Contributor[] = [];
    contributors.forEach((contributor: string) => {
        let currentIndex = uniqueContributors.findIndex(contributor) // Need to finish this
        if (currentIndex != -1)
        {
            uniqueContributors.push({name: contributor, commits: 1});
        }
    })

    removeRepo(repoDirectory); // Removes Repo
    return 0;
}