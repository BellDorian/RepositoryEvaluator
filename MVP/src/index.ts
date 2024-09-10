import chalk from 'chalk';
import { catchArgs } from './Processors/argProcessor';
import { ReadUrlFile } from './Input/Input';
import { buildReposFromUrls } from './Processors/urlProcessor';
import { mockUrls } from './TestUtils/constants';
import { repoQueryBuilder } from './Requests/QueryBuilders/repos';
import { BaseRepoQueryResponse, ReposFromQuery } from './Types/ResponseTypes';
import { requestFromGQL } from './Requests/GitHub/gql';
import * as dotenv from 'dotenv';
import { mapGQLResultToRepos } from './Processors/gqlProcessor';
import { writeNDJSONToCLI } from './Output/CLI';

/**
 * Things to change... our names for variables in the .env. There is a specification in the doc
 * For now..
 * GITHUB_PAT=<Personal access token>
 * GITHUB_API_URL=https://api.github.com/graphql
 */

// temporary filepath
const exampleFilepath = './src/Input/example_inFile.txt';
const contents = ReadUrlFile(exampleFilepath);
// console.log(contents);
// console.log(`🌟 Everything appears to be ${chalk.greenBright('Operational')}! 🌟`);
catchArgs();
dotenv.config();

const runner = async () => {
    const filePath = await catchArgs();
    const urls = ReadUrlFile(filePath ? filePath : './src/Input/example_inFile.txt');
    console.log(urls);
    const repos = await buildReposFromUrls<BaseRepoQueryResponse>(urls); //using mock urls for now
    const query = repoQueryBuilder(repos); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples
    const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query); //result is the raw gql response... .data has your data, .errors has the errors
    const cleanedRepos = mapGQLResultToRepos(result, repos); //mapper to clean the array of repos and add in their query results.

    writeNDJSONToCLI(cleanedRepos);
    process.exit(0);
};

runner();
