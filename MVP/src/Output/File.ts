import { writeFile } from 'fs/promises';
import { NDJSONRow, Repository } from '../Types/DataTypes';
import { convertNDJSONObjToStr } from './CLI';

/**
 *
 * @param repos Repositories array of cleaned repositories {@type Repository<T>[]}
 * @returns a promise {@type Promise<void>}
 */
const writeToTXT = async <T>(repos: Repository<T>[]) =>
    writeFile('./results/RESULTS.txt', repos.map((repo) => convertNDJSONObjToStr(repo.NDJSONRow)).join('\n'));

/**
 * @autor John Leidy
 * @description This function writes our NDJSON rows to a json file in an array
 *
 * @param repos Repositories array of cleaned repositories {@type Repository<T>[]}
 * @returns a promise {@type Promise<void>}
 */
const writeToJSONArr = async <T>(repos: Repository<T>[]) =>
    writeFile(
        './results/RESULTSarr.json',
        `[\n   ${repos.map((repo) => convertNDJSONObjToStr(repo.NDJSONRow)).join(',\n   ')}\n]`
    );

/**
 * @author John Leidy
 * @description This function utilizes Array.prototype.reduce to build an object with
 * keys that are the repositories name and values that are an object with the key NDJSONrow
 * This keys value is the corresponding NDJSONRow for that repository. No return statement :D
 * @param repos An array of cleaned repositories {@type Repository<T>[]}
 * @returns a promise {@type Promise<void>}
 */
const writeToJSONObjs = async <T>(repos: Repository<T>[]) =>
    writeFile(
        './results/RESULTSobjs.json',
        `${JSON.stringify(
            repos.reduce(
                (acc, repo) => ({ ...acc, [repo.repoName]: { NDJSONRow: repo.NDJSONRow } }),
                {} as Record<string, { NDJSONRow: NDJSONRow }>
            ),
            null,
            4
        )}`
    );

export const writeNDJSONToFile = async <T>(repos: Repository<T>[]) => {
    await writeToTXT(repos);
    await writeToJSONArr(repos);
    await writeToJSONObjs(repos);
};
