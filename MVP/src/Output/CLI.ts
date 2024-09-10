import { NDJSONRow, Repository } from '../Types/DataTypes';

const convertNDJSONObjToStr = (NDJSONObj: NDJSONRow) => {
    return `${JSON.stringify(NDJSONObj)}`;
};

export const writeNDJSONToCLI = <T>(repos: Repository<T>[]) => {
    let strBuilder = '';
    console.log('{');
    repos.forEach((repo) => {
        console.log(convertNDJSONObjToStr(repo.NDJSONRow));
    });
    console.log('}');
};
