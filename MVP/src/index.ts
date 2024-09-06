import chalk from 'chalk';
console.log(`🌟 Everything appears to be ${chalk.greenBright('Operational')}! 🌟`);

import { ReadUrlFile } from './Input/Input';

// temporary filepath
const exampleFilepath = './src/Input/example_inFile.txt';
const contents = ReadUrlFile(exampleFilepath);
console.log(contents);
