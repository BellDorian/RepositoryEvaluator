import { NPMRegistryResponse } from '../../Types/ResponseTypes';

/**
 * @author John Leidy
 * @description Takes in a package name, reaches out to the registry, returns the response if it was valid.
 * @param packageName npmjs.org package name extracted from url {@type string}
 * @returns a promise {@type Promise<NPMRegistryResponse>}
 */
export const fetchPackageInfo = async (packageName: string): Promise<NPMRegistryResponse | undefined> => {
    const registryUrl = `https://registry.npmjs.org/${packageName}`;

    try {
        const response = await fetch(registryUrl);
        const rawText = await response.text();
        const jsonResponse = JSON.parse(rawText);
        if (!response.ok) {
            return undefined;
        }
        return jsonResponse;
    } catch (error) {
        console.error('Error fetching package info:', error);
        return undefined;
    }
};
