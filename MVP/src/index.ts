import './Utils/envConfig';
import chalk from 'chalk';
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
import { writeNDJSONToFile } from './Output/File';
import { checkArgsForFile, processArguments } from './Processors/argProcessor';
import { writeNDJSONToCLI } from './Output/CLI';

if (!process.env.LOG_FILE) {
    process.exit(1);
}

const runner = async () => {
    const filePath = await processArguments();
    const cleanUrls = ProvideURLsForQuerying(filePath ? filePath : DEFAULT_URLFILEPATH, true);
    const repos = await buildReposFromUrls<BaseRepoQueryResponse>(cleanUrls);
    const query = repoQueryBuilder(repos, [
        `licenseInfo {
        name
        spdxId
        url
    }`,
    ]); //add an array of fields here... see Request/QueryBuilders/fields.ts for examples

    const result = await requestFromGQL<ReposFromQuery<BaseRepoQueryResponse>>(query); //result is the raw gql response... .data has your data, .errors has the errors
    const cleanedRepos = mapGQLResultToRepos(result, repos); //mapper to clean the array of repos and add in their query results.
    writeNDJSONToFile(cleanedRepos); //result is the raw gql response... .data has your data, .errors has the errors
    LogMessage('Successfully cleaned and scored repos');
    writeNDJSONToCLI(cleanedRepos);
};
LogMessage(`🌟 ${chalk.greenBright('Starting...')} 🌟`);
runner();
