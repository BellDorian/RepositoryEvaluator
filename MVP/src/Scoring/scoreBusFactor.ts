import { Repository, NDJSONRow } from '../Types/DataTypes'
/*
General algorithm: 
Pull from the repository. Get the amount of maintainers
Each maintainer from the last year with more than 10 commits to the project adds a point to the score
Top 10% commit users give 5 points 

*/
export function scoreBusFactor<T>(repo: Repository<T>): number {
     
    return 0;
}