import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { existsSync } from 'fs';
import { ReadUrlFile } from '../Input/Input';

export const grabArgs = async (): Promise<(string | number)[]> => {
    const argv = await yargs(hideBin(process.argv)).argv;
    //should check to be safe
    if (argv._) {
        console.log('Arguments caught..');
        console.log(`Arguments: ${argv._.map((arg) => arg)}`);
        return argv._;
    }
    return [];
};

export const checkArgsForFile = (args: (string | number)[]): string | undefined => {
    let validPaths: string[] = [];
    args.forEach((argument) => {
        if (typeof argument === 'string') {
            if (existsSync(argument)) {
                if (argument.includes('txt')) {
                    console.log('file: ', argument, chalk.greenBright('exists!'));
                    validPaths.push(argument);
                }
            }
        }
    });

    if (validPaths.length > 1) {
        console.log(
            chalk.red('More than one existing file was found in the arguments... proceeding with first file.')
        );
        return validPaths[0];
    } else if (validPaths.length === 1) {
        return validPaths[0];
    } else if (validPaths.length === 0) {
        console.log(chalk.red('NO FILES WERE FOUND WITH THE GIVEN PATHS'));
        console.log(args.map((argument) => argument));
        return undefined;
    } else {
        console.log(chalk.red('unknown *investigate*'));
        return undefined;
    }
};

export const processArguments = async (): Promise<string[]> => {
    const args = await grabArgs();
    console.error(args);
    const filePath = await checkArgsForFile(args);
    if (!filePath) {
        console.log(chalk.red('file not found, defaulting to local file'));
    }
    const urls = await ReadUrlFile(filePath ? filePath : './src/Input/example_inFile.txt');
    return urls;
};
