import { NPMRegistryResponse } from '../../Types/ResponseTypes';

export const fetchPackageInfo = async (packageName: string): Promise<NPMRegistryResponse> => {
    const registryUrl = `https://registry.npmjs.org/${packageName}`;

    try {
        const response = await fetch(registryUrl);
        const rawText = await response.text();
        const jsonResponse = JSON.parse(rawText);
        if (!response.ok) {
            throw new Error(`Package not found, url: ${packageName}`);
        }
        return jsonResponse;
    } catch (error) {
        console.error('Error fetching package info:', error);
        throw error;
    }
};
