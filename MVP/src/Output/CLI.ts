import { NDJSONRow, Repository } from '../Types/DataTypes';

const convertNDJSONObjToStr = (NDJSONObj: NDJSONRow) => {
    return `${JSON.stringify(NDJSONObj)}`;
};

export const writeNDJSONToCLI = <T>(repos: Repository<T>[]) => {
    let strBuilder = '';
    console.log(convertNDJSONObjToStr(repos[0].NDJSONRow));
    // repos.forEach((repo) => {
    //     strBuilder += convertNDJSONObjToStr(repo.NDJSONRow);
    // });
    // console.log(strBuilder);
};
