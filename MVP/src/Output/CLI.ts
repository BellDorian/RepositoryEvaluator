import { NDJSONRow, Repository } from '../Types/DataTypes';

export const convertNDJSONObjToStr = (NDJSONObj: NDJSONRow) => {
    return JSON.stringify(NDJSONObj);
};

export const writeNDJSONToCLI = <T>(repos: Repository<T>[]) => {
    repos.forEach((repo) => {
        console.log(convertNDJSONObjToStr(repo.NDJSONRow));
    });
};
