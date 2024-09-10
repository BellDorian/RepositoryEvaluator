import { NDJSONRow, Repository } from '../Types/DataTypes';

const convertNDJSONObjToStr = (NDJSONObj: NDJSONRow) => {
    return `${JSON.stringify(NDJSONObj)}`;
};

export const writeNDJSONToCLI = <T>(repos: Repository<T>[]) => {
    console.log(convertNDJSONObjToStr(repos[1].NDJSONRow));
};
