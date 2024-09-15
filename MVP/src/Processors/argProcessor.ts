import { existsSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { LogMessage } from '../Utils/log';

/**
 * @author John Leidy
 * @description A func to get the args from the process!
 * @returns a promise {@type Promise<(string|number)[]>}
 */
export const grabArgs = async (): Promise<(string | number)[]> => {
    const argv = await yargs(hideBin(process.argv)).argv;
    return argv._ ? argv._ : [];
};

/**
 * @author John Leidy
 * @description A func to check the arr of arguments for a valid txt file with urls
 * @param args the arguments from the process {@type (string|number)[]}
 * @returns a filepath or... nothing O_o  {@type string|undefined}
 */
export const checkArgsForFile = (args: (string | number)[]): string | undefined => {
    let validPaths: string[] = [];
    args.forEach((argument) => {
        if (typeof argument === 'string') {
            if (existsSync(argument)) {
                if (argument.includes('txt')) {
                    validPaths.push(argument.normalize());
                }
            }
        }
    });
    if (validPaths.length > 1 || validPaths.length === 1) {
        return validPaths[0];
    } else if (validPaths.length === 0) {
        LogMessage('No url files found');
        return undefined;
    } else {
        LogMessage('A suprising else was reached O_o');
        return undefined;
    }
};

/**
 * @author John Leidy
 * @description A function to process arguments given when the process runs.
 * @returns a file path string or... nothing O_o {@type string|undefined}}
 */
export const processArguments = async (): Promise<string | undefined> => {
    const args = await grabArgs();
    const filePath = await checkArgsForFile(args);
    return filePath?.normalize();
};
