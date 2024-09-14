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

import { ReadUrlFile } from './Input/Input';

// temporary filepath
const exampleFilepath = './src/Input/example_inFile.txt';
const contents = ReadUrlFile(exampleFilepath);
console.log(contents);
