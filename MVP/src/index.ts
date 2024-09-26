import './Utils/envConfig';
import chalk from 'chalk';
import { buildReposFromUrls } from './Processors/urlProcessor';
import { repoQueryBuilder } from './Requests/QueryBuilders/repos';
import { BaseRepoQueryResponse, ReposFromQuery } from './Types/ResponseTypes';
import { requestFromGQL } from './Requests/GitHub/gql';
import { mapGQLResultToRepos } from './Processors/gqlProcessor';
import { DEFAULT_URLFILEPATH } from './Input/Input';
import { LogDebug, LogInfo } from './Utils/log';
import { ProvideURLsForQuerying } from './Input/Sanitize';
import { writeNDJSONToFile } from './Output/File';
import { processArguments } from './Processors/argProcessor';
import { writeNDJSONToCLI } from './Output/CLI';
import { scoreRepositoriesArray } from './Scoring/scoring';
import { createLicenseField } from './Requests/QueryBuilders/fields';
import * as dot from 'dotenv';
import { NDJSONRow, Repository } from './Types/DataTypes';

const isNotMin = (netScore: number, scores: number[]) => Math.min(netScore, ...scores) != netScore;

const isNotMax = (netScore: number, scores: number[]) => Math.max(netScore, ...scores) != netScore;

const checkScore = <T>(repo: Repository<T>, idx: number, maxMin: 'max' | 'min') => {
    LogInfo(
        `_____________Checking ${maxMin.toLocaleUpperCase()} for ${
            repo.repoName
        } at idx ${idx}__________________________`
    );
    if (
        repo.NDJSONRow !== undefined &&
        repo.NDJSONRow.NetScore !== undefined &&
        repo.NDJSONRow.RampUp !== undefined &&
        repo.NDJSONRow.Correctness !== undefined &&
        repo.NDJSONRow.BusFactor !== undefined &&
        repo.NDJSONRow.ResponsiveMaintainer !== undefined &&
        repo.NDJSONRow.License !== undefined
    ) {
        const repoScores = [
            repo.NDJSONRow.RampUp,
            repo.NDJSONRow.Correctness,
            repo.NDJSONRow.BusFactor,
            repo.NDJSONRow.ResponsiveMaintainer,
            repo.NDJSONRow.License,
        ];
        LogInfo(
            `${maxMin} COMPARISON: Comparison arr: ${repoScores.map((score) => score)}, net score: ${
                repo.NDJSONRow.NetScore
            }`
        );
        if (repo.NDJSONRow.License === 0) {
            LogInfo('Returning true, license is 0');
            return true;
        }
        if (maxMin === 'max') {
            LogInfo(`Result: ${isNotMax(repo.NDJSONRow.NetScore, repoScores)}`);
            return isNotMax(repo.NDJSONRow.NetScore, repoScores);
        } else if (maxMin === 'min') {
            LogInfo(`Result: ${isNotMin(repo.NDJSONRow.NetScore, repoScores)}`);
            return isNotMin(repo.NDJSONRow.NetScore, repoScores);
        }
    }
};

const checkScores = <T>(repos: Repository<T>[]) => {
    LogInfo(`Number of repos: ${repos.length}`);
    LogInfo(
        `${repos.map((repo, idx) => {
            const netScoreMin = checkScore(repo, idx, 'min');
            const netScoreMax = checkScore(repo, idx, 'max');
            return netScoreMin === true && netScoreMax === true;
        })}`
    );
};

dot.config();
if (!process.env.LOG_FILE) {
    process.exit(1);
}
const runner = async () => {
    const filePath = await processArguments();
    const cleanUrls = ProvideURLsForQuerying(filePath ? filePath : DEFAULT_URLFILEPATH, true);
    const repos = await buildReposFromUrls<BaseRepoQueryResponse>(cleanUrls);
    const query = repoQueryBuilder(repos, [createLicenseField(), 'stargazerCount']); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples
    const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query); //result is the raw gql response... .data has your data, .errors has the errors
    console.log(result);
    const cleanedRepos = mapGQLResultToRepos(result, repos);
    const res = await scoreRepositoriesArray<BaseRepoQueryResponse>(cleanedRepos); //mapper to clean the array of repos and add in their query results.
    writeNDJSONToFile(res); //result is the raw gql response... .data has your data, .errors has the errors
    LogDebug('Successfully cleaned and scored repos');
    writeNDJSONToCLI(res);
    checkScores(res);
};
LogDebug(`🌟 ${chalk.greenBright('Starting...')} 🌟`);
runner();
