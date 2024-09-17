import { Reporter } from '@jest/reporters';
import fs from 'fs';

class CustomReporter implements Reporter {
    onRunComplete(contexts: Set<unknown>, results: any): void {
        const output = `Tests: ${results.numPassedTests} passed, ${results.numTotalTests} total`;
        fs.writeFileSync('./coverage/output.txt', output);
    }
}

export default CustomReporter;
