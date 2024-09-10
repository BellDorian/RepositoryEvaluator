import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const catchArgs = async () => {
    const argv = await yargs(hideBin(process.argv)).argv;
    //should check to be safe
    if (argv._) {
        // console.log('Arguments caught..');
        // console.log(`Arguments: ${argv._.map((arg) => arg)}`);
        const args = argv._;
        console.log(argv);
    }
    // console.log('argv obj: ', argv);
};
