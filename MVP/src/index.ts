import chalk from 'chalk';
import { catchArgs } from './Processors/argProcessor';
import { buildReposFromUrls } from './Processors/urlProcessor';
import { mockUrls } from './TestUtils/constants';
import { repoQueryBuilder } from './Requests/QueryBuilders/repos';
import { BaseRepoQueryResponse, ReposFromQuery } from './Types/ResponseTypes';
import { requestFromGQL } from './Requests/GitHub/gql';
import * as dotenv from 'dotenv';
import { mapGQLResultToRepos } from './Processors/gqlProcessor';

import { DEFAULT_URLFILEPATH } from './Input/Input';
import * as Sanitizer from './Input/Sanitize';
import { writeNDJSONToFile } from './Output/File';

/**
 * Things to change... our names for variables in the .env. There is a specification in the doc
 * For now..
 * GITHUB_PAT=<Personal access token>
 * GITHUB_API_URL=https://api.github.com/graphql
 */

const cleanUrls = Sanitizer.ProvideURLsForQuerying(DEFAULT_URLFILEPATH, true);
console.log(cleanUrls.github_URLs);
console.log(cleanUrls.npm_URLs);

console.log(`🌟 Everything appears to be ${chalk.greenBright('Operational')}! 🌟`);
catchArgs();
dotenv.config();

const runner = async () => {
    const cleanUrls = Sanitizer.ProvideURLsForQuerying(DEFAULT_URLFILEPATH, true);
    console.log(cleanUrls);
    console.log(cleanUrls.github_URLs.map((g) => g?.tokens));
    console.log(cleanUrls.npm_URLs.map((g) => g?.tokens));
    const repos = await buildReposFromUrls<BaseRepoQueryResponse>(cleanUrls); //using mock urls for now

    const query = repoQueryBuilder(repos, ['stargazerCount']); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples
    console.log(query);
    const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query);
    console.log(result); //result is the raw gql response... .data has your data, .errors has the errors
    const cleanedRepos = mapGQLResultToRepos(result, repos); //mapper to clean the array of repos and add in their query results.
    console.log(cleanedRepos);
    writeNDJSONToFile(cleanedRepos);
};

runner();
