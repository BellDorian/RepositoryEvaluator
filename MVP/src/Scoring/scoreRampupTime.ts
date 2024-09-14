import { repoQueryBuilder } from '../Requests/QueryBuilders/repos';
import { Repository, NDJSONRow } from '../Types/DataTypes'
/*
General algorithm: 

*/
export function scoreRampupTime<T>(repo: Repository<T>): number {
     
    const query = repoQueryBuilder(repo, [stargazerCount]);
    return 0;
}