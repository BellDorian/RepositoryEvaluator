//     Project :    Module Evaluation Tool
//   Component :    Input Processing
//       Owner :    Dorian Bell II
// Last update :    06 September 2024 -- EST 12:50

import { readFileSync } from 'fs';

/**
 * @author Dorian Bell II
 * Reads the file at the given filepath. Retrieves its contents line-by-line
 * 
 *
 * @remarks
 * The function expects each line to be a different module link.
 * Each link must be to a GitHub repo or an npm listing that has a
 * corresponding GitHub repo.
 *
 * @param filepath
 * @returns An array of {@type string} urls
 *
 */
export function ReadUrlFile(filepath: string): string[] {
    var fileContents = readFileSync(filepath, 'utf8');
    const urls = fileContents.split('\n');

    let size = urls.length;
    return urls;
}



