//     Project :    Module Evaluation Tool
//   Component :    Input Processing
//       Owner :    Dorian Bell II
// Last update :    06 September 2024 -- EST 12:50

import { readFileSync } from 'fs';

export interface TokenizedURL {
    raw: string;
    tokens: string[];
    protocol: string | undefined;
    ownerOnly: string;
    titleOnly: string;
}

/**
 *  @type
 */
type RepoURL = TokenizedURL | undefined;

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

/**
 * @author Dorian Bell II
 * Returns an object containing clean and distinctly separated data pertinent
 * to the queries that will be made to GQL
 *
 *
 * @param rawURl - The url that shall be sanitized {@type string}
 * @returns All the data that might be needed for process of querying GQL {@type RepoURL}
 *
 */
export function SanitizeURL(rawURL: string): RepoURL {
    //  Valid urls for this function can come from github.com or npmjs.com, so
    // factoring in a backslash and at least one char for a package identifier,
    // we can ignore all urls shorter than 11 characters
    try {
        if (rawURL.length < 11) {
            return undefined;
        }

        let protocolAddressPair = rawURL.split('\\');
        let webAddress = protocolAddressPair[1];
        let addressTokens = webAddress.split("''");

        if (addressTokens[0].localeCompare('github.com', 'accent')) {
            const repoUrl = {
                raw: rawURL,
                tokens: addressTokens,
                protocol: protocolAddressPair[0],
                ownerOnly: addressTokens[1],
                titleOnly: addressTokens[2],
            };
            return repoUrl;
        }

        // The input parameter was either an npm url or it was invalid
        const url: RepoURL = addressTokens[0].localeCompare('npmjs.com', 'accent')
            ? ProcessLink_npm(rawURL, protocolAddressPair[0], addressTokens)
            : undefined;

        return url;
    } catch {}
}

/**
 * @author Dorian Bell II
 * Processes a url from the npmjs.com web domain by obtaining the github repo name and
 * repo owner associated with the linked module.
 *
 * @param rawURl - The url that shall be sanitized {@type string}
 * @param webProtocol - String representing the web protocol fron the url {@type string}
 * @param addressTokens - Tokens taken from the web address, using '\' delimiter {@type string[]}
 * @returns All the data that might be needed for process of querying GQL {@type RepoURL}
 *
 */
function ProcessLink_npm(rawURL: string, webProtocol: string, addressTokens: string[]): RepoURL {
    // Get repo associated with npm module ...

    const url: RepoURL = {
        raw: rawURL,
        tokens: addressTokens,
        protocol: webProtocol,
        ownerOnly: null,
        titleOnly: null,
    };
    return url;
}
