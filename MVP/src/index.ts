import chalk from 'chalk';
import { catchArgs } from './Processors/argProcessor';
console.log(`🌟 Everything appears to be ${chalk.greenBright('Operational')}! 🌟`);
catchArgs();

import { ReadUrlFile } from './Input/Input';

// temporary filepath
const exampleFilepath = './src/Input/example_inFile.txt';
const contents = ReadUrlFile(exampleFilepath);
console.log(contents);
