import { NDJSONRow, Repository } from '../Types/DataTypes';

const convertNDJSONObjToStr = (NDJSONObj: NDJSONRow) => {
    return `${JSON.stringify(NDJSONObj)}\n`;
};

export const writeNDJSONToCLI = <T>(repos: Repository<T>[]) => {
    let strBuilder = '';
    repos.forEach((repo) => {
        strBuilder += convertNDJSONObjToStr(repo.NDJSONRow);
    });
};
