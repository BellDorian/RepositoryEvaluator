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

const git = require('isomorphic-git');
import * as fileSystem from 'fs';
import { LogDebug } from '../Utils/log';
const http = require('isomorphic-git/http/node');

export type Contributor = {
    name: string;
    commitCount: number;
};

type CC = { [key: string]: number };

const countCommits = (log: any): { [key: string]: number } => {
    const res: CC = {};
    if (log) {
        log.forEach((logItem: any) => {
            if (logItem.commit && logItem.commit.author && logItem.commit.author.name) {
                if (Object.keys(res).includes(logItem.commit.author.name)) {
                    res[logItem.commit.author.name] += 1;
                } else {
                    res[logItem.commit.author.name] = 1;
                }
            }
        });
    }
    return res;
};

const filterLow = (contributors: CC) => {
    let store: CC = {};
    Object.entries(contributors).forEach((contributor) => {
        if (contributor[1] > 5) {
            store[contributor[0]] = contributor[1];
        }
    });
    return store;
};

function removeRepo(directory: string) {
    if (fileSystem.existsSync(directory)) {
        // Recursively remove all files and subdirectories
        fileSystem.rmSync(directory, { recursive: true, force: true });
        console.log(`Repository at ${directory} has been removed.`);
    } else {
        console.log(`Directory ${directory} does not exist.`);
    }
}

export async function scoreBusFactor<T>(repo: Repository<T>): Promise<number> {
    const contributors = new Set();
    if (repo.queryResult?.ref?.target?.history.edges) {
        repo.queryResult?.ref?.target?.history.edges.forEach((edge) => {
            contributors.add(edge.node.author.name);
        });
    }

    const contributorCount = contributors.size;
    const maxExpectedContributors = 10;
    let score = Math.min(1, contributorCount / maxExpectedContributors);

    const repoDirectory = `./REPO_DUMP/${repo.repoName}`;
    try {
        await git.clone({
            fs: fileSystem,
            http,
            singleBranch: true,
            dir: `./${repoDirectory}`,
            url: repo.fileUrl,
        });

        const gitLog = await git.log({
            fs: fileSystem,
            dir: repoDirectory,
            depth: 100,
        });
        const res = countCommits(gitLog);
        console.log(res);
        const fil = filterLow(res);
        console.log(fil);
        const maxExpectedContributors = 10;
        score = Math.min(1, contributors.size / maxExpectedContributors);
        // const contributorNames: string[] = [];
        // gitLog.forEach((commit: any) => {
        //     console.log('COMMIT', commit.commit.author);
        //     const commitAuthor: string = commit.commit.author.name;
        //     contributorNames.push(commitAuthor);
        // });
        // type Contributor = {
        //     name: string;
        //     commits?: number;
        // };

        // let uniqueContributors: Contributor[] = [];
        // uniqueContributors.push({ name: contributorNames[0], commits: 1 }); // First contributor guarenteed to be unique
        // uniqueContributors.slice(1);

        // // Collects unique contributors and their number of commits
        // contributorNames.forEach((contributor: string) => {
        //     let currentIndex = -1;
        //     for (let i = 0; i < uniqueContributors.length; i++) {
        //         if (uniqueContributors[i].name == contributor) {
        //             currentIndex = i;
        //             break;
        //         }
        //     }
        //     if (currentIndex != -1) {
        //         uniqueContributors.push({ name: contributor, commits: 1 });
        //     } else {
        //         if (uniqueContributors[currentIndex]?.commits) {
        //             let c = uniqueContributors[currentIndex].commits;
        //             if (c) c += 1;
        //             uniqueContributors[currentIndex].commits = c;
        //         }
        //     }
        // });
        // removeRepo(repoDirectory);
        // if (uniqueContributors.length == 1) {
        //     return 0; // Bus Factor of only 1
        // }

        // // Sorts by commits
        // uniqueContributors.sort((a, b) => b.commits - a.commits);
        // // Using the number of commits the largest contributor,
        // // sets a benchmark that is used to determine whether or not a contributor can be considered part of the bus factor
        // let primaryContributorCommits = uniqueContributors[0].commits;
        // // Currently, percentages have to add up to 1. Perfectly fine to leave it like this though
        // const highPercentage = 0.75;
        // const lowPercentage = 0.25;
        // let highCommitBenchmark = primaryContributorCommits * highPercentage;
        // let lowCommitBenchmark = primaryContributorCommits * lowPercentage;
        // let highContributorScore = 0;
        // let lowContributorScore = 0;
        // for (let i = 1; i < uniqueContributors.length; i++) {
        //     if (uniqueContributors[i].commits >= highCommitBenchmark) {
        //         highContributorScore++;
        //     } else if (uniqueContributors[i].commits >= lowCommitBenchmark) {
        //         lowContributorScore++;
        //     }
        // }
        // Using the Sigmoid function to get the desired distribution of the score.

        // const distrubutionMultiplier = 0.8; // As this value -> 0, it requires more contributors to get close to a 1. Can be edited to produce a different score distribution
        // highContributorScore = 1 / (1 + Math.pow(Math.E, distrubutionMultiplier * -highContributorScore - 5));
        // lowContributorScore = 1 / (1 + Math.pow(Math.E, distrubutionMultiplier * -highContributorScore - 5));
        // // Returns weighted average of score obtained through high commit numbers and low commit numbers.
        // console.log('iso success');
        // score = highContributorScore * highPercentage + lowContributorScore * lowPercentage;
    } catch (err) {
        console.log('iso failed');
        console.log(err instanceof Error ? err.message : '');
        LogDebug(err instanceof Error ? err.message : 'unkown error occured');
    }
    return score;
}
