import { ReadURLFile } from './Input';
import * as URL from '../Types/URLTypes';

/**
 * @author Dorian Bell II
 * @description
 * - Procures a set of sanitized urls to make queries from, using a given filepath
 *   as the url source.
 *
 *
 * @param filepath - The path to the file containing the urls to be sanitized
 * @param fallbackToDefaultPath - y/n try to use the default filepath if the given path fails
 * @returns An object containing tokens from sanitized urls {@type CleanURLSet}
 *
 * @remarks
 * This function calls ReadURLFile and then SanitizeUrlSet.
 */
export function ProvideURLsForQuerying(
    filepath: string,
    fallbackToDefaultPath: boolean = false
): URL.CleanURLSet {
    const urls = ReadURLFile(filepath, fallbackToDefaultPath);
    console.log(urls);
    return SanitizeUrlSet(urls);
}

/**
 * @author Dorian Bell II
 * @description
 * - Returns an object containing clean and distinctly separated url tokens pertinent
 *   to the queries that will be made to the npm registry and GQL
 *
 *
 * @param rawURls - The set of urls that shall be sanitized {@type string | undefined}
 * @returns All the data that might be needed for process of querying GQL {@type CleanURLSet}
 *
 * @remarks
 * The function returns an empty CleanURLSet if an undefined string array is provided
 */
export function SanitizeUrlSet(rawUrls: string[] | undefined): URL.CleanURLSet {
    // Immediately quite this process with an empty CleanURLSet if an invalid URL set was provided
    if (!rawUrls) {
        return new URL.CleanURLSet(0, 0);
    }

    // Now that that's out of the way, we can sanitize each string
    let url, protocolAddressPair, protocol, webAddress, addressTokens;
    let size = rawUrls.length;
    const cleanURLs = new URL.CleanURLSet(size, size);

    // HERE FOR UNIT TESTING
    console.log(rawUrls);

    for (var i = 0; i < size; i++) {
        try {
            url = rawUrls[i];
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
        } catch {
            continue;
        }
    }

    return cleanURLs;
}

/**
 * @author Dorian Bell II
 * @description
 * - Returns an object containing clean and distinctly separated url tokens pertinent
 *   to the queries that will be made to the npm registry and GQL
 *
 *
 * @param raw - A single raw url to be processed {@type string}
 * @returns All the data that might be needed for process of querying GQL {@type RepoURL | undefined}
 *
 * @throws
 * An error gets thrown if anything goes wrong in the process of building the URLobj
 */
export function TryBuildRepoURL(raw: string): URL.RepoURL | undefined {
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
        throw new Error('The RepoURL failed to be built');
    }
}

/**
 * @author Dorian Bell II
 * @description
 * - Returns an object containing clean and distinctly separated url tokens pertinent
 *   to the queries that will be made to the npm registry and GQL
 *
 *
 * @param raw - A single raw url to be processed {@type string}
 * @returns All the data that might be needed for process of querying GQL {@type PackageURL | undefined}
 *
 * @throws
 * An error gets thrown if anything goes wrong in the process of building the URLobj
 */
export function TryBuildPackageURL(raw: string): URL.PackageURL | undefined {
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
            return BuildCleanURL_npm(raw, protocol, addressTokens);
        }
        return undefined;
    } catch {
        throw new Error('The PackageURL failed to be built');
    }
}

/**
 * @author Dorian Bell II ; John Leidy
 * @description
 * - Processes a url from the npmjs.com web domain by verifying its domain and format,
 *  and then couples the url tokens within an object
 *
 *
 * @param rawURl - The url that shall be sanitized {@type string}
 * @param webProtocol - String representing the web protocol fron the url {@type string}
 * @param addressTokens - Tokens taken from the web address, using '\' delimiter {@type string[]}
 * @returns Tokenized url data, which can be used to Query the npm registry {@type PackageURL}
 *
 * @remarks
 * The only thing that should vary between valid npm urls is the package name part.
 * This is stored in index 2 of a given set of address tokens
 */
function BuildCleanURL_npm(rawURL: string, webProtocol: string, addressTokens: string[]): URL.PackageURL {
    try {
        // npm url format: [web protocol]\\[npmjs.com]\package\[package name]
        const packageInfo = rawURL.match(/\/package\/(.+)/);
        const title = packageInfo ? packageInfo[1] : ' ';

        const packageUrl: URL.PackageURL = {
            raw: rawURL,
            tokens: addressTokens,
            protocol: webProtocol,
            packageName: title,
        };
        return packageUrl;
    } catch {
        throw new Error('This build operation failed');
    }
}

/**
 * @author Dorian Bell II
 * @description
 * - Processes a url from the github.com web domain by verifying its domain and format,
 *  and then couples the url tokens within an object
 *
 *
 * @param rawURl - The url that shall be sanitized {@type string}
 * @param webProtocol - String representing the web protocol fron the url {@type string}
 * @param addressTokens - Tokens taken from the web address, using '\' delimiter {@type string[]}
 * @returns Tokenized url data needed for the process of querying GQL {@type RepoURL}
 *
 * @remarks
 * The only thing that should vary between valid npm urls is the package name part.
 * This is stored in index 2 of a given set of address tokens
 */
function BuildCleanURL_github(rawURL: string, webProtocol: string, addressTokens: string[]): URL.RepoURL {
    try {
        const repoUrl: URL.RepoURL = {
            raw: rawURL,
            tokens: addressTokens,
            protocol: webProtocol,
            repoOwner: addressTokens[1],
            repoName: addressTokens[2],
        };
        return repoUrl;
    } catch {
        throw new Error('This build operation failed');
    }
}
