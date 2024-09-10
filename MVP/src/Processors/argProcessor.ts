import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const catchArgs = async () => {
    const argv = await yargs(hideBin(process.argv)).argv;
    if (typeof argv._[0] === 'string') return argv._[0];
    else return undefined;
};
