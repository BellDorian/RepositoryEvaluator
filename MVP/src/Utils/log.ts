import './envConfig';
import * as fs from 'fs';

// Obtain the environment variables. If they are not set, use the default values
// below. The verbosity level will be 0 by default as per instructions.
const LOG_LEVEL = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL, 10) : 0;
const LOG_FILE = process.env.LOG_FILE || '../Logs/temporary.log';

/**
 * @author Jorge Puga Hernandez
 * @description
 * - This function will check if the log file exists by using its path.
 * If it does not exist, then an empty log file will be created.
 *
 */
function CreateLogFile() {
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, '', { flag: 'w' });
    }
}

/**
 * @author Jorge Puga Hernandez
 * @description
 * - This function will log messages to the log file with the locale time
 * format. If the log file does not exist, then it will be created
 * by calling the CreateLogFile function.
 * - If the level is 0, then nothing will be logged.
 * - If the level is 1, then the informational message will be logged.
 * - If the level is 2, then the debug message will be logged.
 *
 * @param message - The message to log. {@type string}
 *
 */
export function LogMessage(message: string) {
    if (LOG_LEVEL == 0) {
        return;
    } else if (LOG_LEVEL == 1 || LOG_LEVEL == 2) {
        CreateLogFile();
        const logEntry = `${new Date().toLocaleString()} - ${message}\n`;
        fs.appendFileSync(LOG_FILE, logEntry);
    }
}
