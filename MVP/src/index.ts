import chalk from 'chalk';
import { catchArgs } from './Processors/argProcessor';
import { buildReposFromUrls } from './Processors/urlProcessor';
import { mockUrls } from './TestUtils/constants';
import { repoQueryBuilder } from './Requests/QueryBuilders/repos';
import { BaseRepoQueryResponse, ReposFromQuery } from './Types/ResponseTypes';
import { requestFromGQL } from './Requests/GitHub/gql';
import * as dotenv from 'dotenv';
import { mapGQLResultToRepos } from './Processors/gqlProcessor';
import { ProvideURLsForQuerying } from './Input/Input';

/**
 * Things to change... our names for variables in the .env. There is a specification in the doc
 * For now..
 * GITHUB_PAT=<Personal access token>
 * GITHUB_API_URL=https://api.github.com/graphql
 */

console.log(`🌟 Everything appears to be ${chalk.greenBright('Operational')}! 🌟`);
catchArgs();
dotenv.config();

const runner = async () => {
    const exampleFilepath = './src/TestUtils/invalidUrls.txt';
    const cleanUrls = ProvideURLsForQuerying(exampleFilepath);
    const repos = await buildReposFromUrls<BaseRepoQueryResponse>(cleanUrls); //using mock urls for now
    const query = repoQueryBuilder(repos); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples
    const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query); //result is the raw gql response... .data has your data, .errors has the errors
    const cleanedRepos = mapGQLResultToRepos(result, repos); //mapper to clean the array of repos and add in their query results.

    console.log(cleanedRepos);
};

runner();
