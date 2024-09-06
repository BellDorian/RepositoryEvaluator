import chalk from 'chalk';
import { catchArgs } from './Processors/argProcessor';
console.log(`🌟 Everything appears to be ${chalk.greenBright('Operational')}! 🌟`);
catchArgs();

import { main } from './Input/test';
import { lstat } from 'fs';


const x = main();