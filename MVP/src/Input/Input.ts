//     Project :    Module Evaluation Tool
//   Component :    Input Processing
//       Owner :    Dorian Bell II
// Last update :    06 September 2024 -- EST 12:50

import { boolean } from 'yargs';
import { readFileSync } from 'fs';

export interface TokenizedURL {
    raw: string;
    tokens: string[];
    protocol: string | undefined;
}

export interface Repo_TokenizedURL extends TokenizedURL {
    repoOwner: string;
    repoName: string;
}

export interface Package_TokenizedURL extends TokenizedURL {
    packageName: string;
}

export type RepoURL = Repo_TokenizedURL | undefined;
export type PackageURL = Package_TokenizedURL | undefined;

export class CleanURLSet {
    repoCapacity: number = 5;
    packageCapacity: number = 5;
    github_URLs: RepoURL[] = [];
    npm_URLs: PackageURL[] = [];
    gitCount: number = 0;
    npmCount: number = 0;

    Copy(rhs: CleanURLSet) {
        this.repoCapacity = rhs.repoCapacity;
        this.packageCapacity = rhs.packageCapacity;
        this.github_URLs = rhs.github_URLs;
        this.npm_URLs = rhs.npm_URLs;
        this.gitCount = rhs.gitCount;
        this.npmCount = rhs.npmCount;
    }

    constructor(maxRepoCount: number, maxPackageCount: number) {
        this.repoCapacity = maxRepoCount;
        this.packageCapacity = maxPackageCount;
        this.github_URLs;
    }

    AddRepoURL(github_URL: RepoURL): boolean {
        try {
            this.github_URLs[this.gitCount] = github_URL;
            this.gitCount++;
            return true;
        } catch {
            return false;
        }
    }

    AddPackageURL(npm: PackageURL): boolean {
        try {
            this.npm_URLs[this.npmCount] = npm;
            this.npmCount++;
            return true;
        } catch {
            return false;
        }
    }

    AddRepoURL_NullFiltered(github_URL: Repo_TokenizedURL): boolean {
        return github_URL ? this.AddRepoURL(github_URL) : false;
    }

    AddPackageURL_NullFiltered(npm_URL: Package_TokenizedURL): boolean {
        return npm_URL ? this.AddPackageURL(npm_URL) : false;
    }
}

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
 * @param filepath - The path to the file containing the urls
 * @returns An array of {@type string} urls
 *
 */
export function ReadUrlFile(filepath: string): string[] {
    var fileContents = readFileSync(filepath, 'utf8');
    const urls = fileContents.split('\n');
    return urls;
}

/**
 * @author Dorian Bell II
 * Procures a set of sanitized urls to make queries from, using a given filepath
 * as the url source.
 *
 *
 * @remarks
 * This function calls ReadURLFile and then SanitizeUrlSet.
 *
 * @param filepath - The path to the file containing the urls to be sanitized
 * @returns An object containing tokens from sanitized urls {@type CleanURLSet}
 *
 */
export function ProvideURLsForQuerying(filepath: string): CleanURLSet {
    const urls = ReadUrlFile(filepath);
    return SanitizeUrlSet(urls);
}

/**
 * @author Dorian Bell II
 * Returns an object containing clean and distinctly separated url tokens pertinent
 * to the queries that will be made to the npm registry and GQL
 *
 *
 * @param rawURls - The set of urls that shall be sanitized {@type string}
 * @returns All the data that might be needed for process of querying GQL {@type CleanURLSet}
 *
 */
export function SanitizeUrlSet(rawUrls: string[]): CleanURLSet {
    let size = rawUrls.length;
    const cleanURLs = new CleanURLSet(size, size);
    let url, protocolAddressPair, protocol, webAddress, addressTokens;

    // HERE FOR UNIT TESTING
    console.log(rawUrls);

    for (var i = 0; i < size; i++) {
        try {
            let url = rawUrls[i];
            if (url.length < 11) {
                continue;
            }

            // Splitting web protocol from web address
            protocolAddressPair = url.split('//');
            protocol = protocolAddressPair[0];
            webAddress = protocolAddressPair[1];
            addressTokens = webAddress.split('/');

            if (addressTokens[0] == 'github.com') {
                cleanURLs.AddRepoURL(BuildCleanURL_github(url, protocol, addressTokens));
            } else if (addressTokens[0] == 'www.npmjs.com') {
                cleanURLs.AddPackageURL(BuildCleanURL_npm(url, protocol, addressTokens));
            } else {
            }
        } catch {}
    }
    return cleanURLs;
}

/**
 * @author Dorian Bell II
 * Returns an object containing clean and distinctly separated url tokens pertinent
 * to the queries that will be made to the npm registry and GQL
 *
 * @param raw - A single raw url to be processed {@type string}
 * @returns All the data that might be needed for process of querying GQL {@type RepoURL | undefined}
 *
 */
export function SanitizeURL_GitHub(raw: string): RepoURL | undefined {
    try {
        let protocolAddressPair, protocol, webAddress, addressTokens;
        if (raw.length < 11) {
            return undefined;
        }

        // Splitting web protocol from web address
        protocolAddressPair = raw.split('//');
        protocol = protocolAddressPair[0];
        webAddress = protocolAddressPair[1];
        addressTokens = webAddress.split('/');

        if (addressTokens[0] == 'github.com') {
            return BuildCleanURL_github(raw, protocol, addressTokens);
        }
        return undefined;
    } catch {
        return undefined;
    }
}

/**
 * @author Dorian Bell II
 * Processes a url from the npmjs.com web domain by verifying its domain and format,
 * and then couples the url tokens within an object
 *
 * @remarks
 * The only thing that should vary between valid npm urls is the package name part.
 * This is stored in index 2 of a given set of address tokens
 *
 * @param rawURl - The url that shall be sanitized {@type string}
 * @param webProtocol - String representing the web protocol fron the url {@type string}
 * @param addressTokens - Tokens taken from the web address, using '\' delimiter {@type string[]}
 * @returns Tokenized url data, which can be used to Query the npm registry {@type PackageURL}
 *
 */
function BuildCleanURL_npm(rawURL: string, webProtocol: string, addressTokens: string[]): PackageURL {
    try {
        // npm url format: [web protocol]\\[npmjs.com]\package\[package name]
        const title = addressTokens[2].charAt(0) == '@' ? addressTokens[3] : addressTokens[2];

        const packageUrl: PackageURL = {
            raw: rawURL,
            tokens: addressTokens,
            protocol: webProtocol,
            packageName: title,
        };
        return packageUrl;
    } catch {
        return undefined;
    }
}

/**
 * @author Dorian Bell II
 * Processes a url from the github.com web domain by verifying its domain and format,
 * and then couples the url tokens within an object
 *
 * @remarks
 * The only thing that should vary between valid npm urls is the package name part.
 * This is stored in index 2 of a given set of address tokens
 *
 * @param rawURl - The url that shall be sanitized {@type string}
 * @param webProtocol - String representing the web protocol fron the url {@type string}
 * @param addressTokens - Tokens taken from the web address, using '\' delimiter {@type string[]}
 * @returns Tokenized url data needed for the process of querying GQL {@type RepoURL}
 *
 */
function BuildCleanURL_github(rawURL: string, webProtocol: string, addressTokens: string[]): RepoURL {
    try {
        const repoUrl: RepoURL = {
            raw: rawURL,
            tokens: addressTokens,
            protocol: webProtocol,
            repoOwner: addressTokens[1],
            repoName: addressTokens[2],
        };
        return repoUrl;
    } catch {}
}
