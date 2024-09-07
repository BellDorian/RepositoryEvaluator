import chalk from 'chalk';
import { Repository } from '../Types/DataTypes';
import { GraphQLResponse, ReposFromQuery } from '../Types/ResponseTypes';
//we get back an obj with repos... they either have information of some type or they dont (null)
//if they have some information we add it to the cooresponding repository
//if they don't we remove the repository from the array

export const mapGQLResultToRepos = <T>(
    GraphQLResult: GraphQLResponse<ReposFromQuery<T>> | undefined,
    repos: Repository<T>[]
) => {
    if (GraphQLResult) {
        Object.entries(GraphQLResult.data).forEach(([key, value]) => {
            //if its not null we are going to set it to the repo in our repo arr
            if (value) {
                if (value.owner.login) {
                    repos.forEach((repo) => {
                        if (repo.owner === value.owner.login) {
                            repo.queryResult = value;
                        }
                    });
                }
            }
        });
        //we only want the repos that we got a successful return from
        return repos.filter((repo) => {
            if (repo.queryResult === null) {
                console.error(
                    chalk.red(`URL: ${repo.fileUrl} failed to process. GQL returned a null response.`)
                );
            }
            return repo.queryResult !== null;
        });
    } else {
        return repos;
    }
};
