import './Utils/envConfig';
import chalk from 'chalk';
import { catchArgs } from './Processors/argProcessor';
import { buildReposFromUrls } from './Processors/urlProcessor';
import { mockUrls } from './TestUtils/constants';
import { repoQueryBuilder } from './Requests/QueryBuilders/repos';
import { BaseRepoQueryResponse, ReposFromQuery } from './Types/ResponseTypes';
import { requestFromGQL } from './Requests/GitHub/gql';
import { mapGQLResultToRepos } from './Processors/gqlProcessor';
import { DEFAULT_URLFILEPATH } from './Input/Input';
import { LogMessage } from './Utils/log';
import { ErrorWrapper, ErrorWrapperForAsync, ErrorWrapperForReturns } from './Utils/errorHandling';
import { ProvideURLsForQuerying } from './Input/Sanitize';

const cleanUrls = ProvideURLsForQuerying(DEFAULT_URLFILEPATH, true);
console.log(cleanUrls.github_URLs);
console.log(cleanUrls.npm_URLs);

LogMessage('Starting...');
console.log(`🌟 Everything appears to be ${chalk.greenBright('Operational')}! 🌟`);

catchArgs();

const runner = async () => {
    const cleanUrls = ProvideURLsForQuerying(DEFAULT_URLFILEPATH, true);
    const repos = await buildReposFromUrls<BaseRepoQueryResponse>(cleanUrls); //using mock urls for now
    const query = repoQueryBuilder(repos); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples
    const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query); //result is the raw gql response... .data has your data, .errors has the errors
    const cleanedRepos = mapGQLResultToRepos(result, repos); //mapper to clean the array of repos and add in their query results.
    LogMessage('Successfully cleaned and scored repos');
    console.log(cleanedRepos);
};
//commit
ErrorWrapperForAsync(runner, 'Error occured during runner exec');
runner();
