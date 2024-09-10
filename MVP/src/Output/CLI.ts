import { NDJSONRow, Repository } from '../Types/DataTypes';

const convertNDJSONObjToStr = (NDJSONObj: NDJSONRow) => {
    return `${JSON.stringify(NDJSONObj)}`;
};

export const writeNDJSONToCLI = <T>(repos: Repository<T>[]) => {
    let strBuilder = '';
    repos.forEach((repo) => {
        console.log(convertNDJSONObjToStr(repo.NDJSONRow));
    });
};
