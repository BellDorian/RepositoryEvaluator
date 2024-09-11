import { OpenAI } from 'openai';
import { Repository } from '../Types/DataTypes';
import { resolve } from 'path';

/**
 * Tim Carpenter
 *
 * Evaluates the license compatibility score of a repository using the OpenAI API
 *
 * @template T - The type of the data stored in the repository (generic)
 * @param {Repository<T>} repo - The repository to be evaluated
 * @returns 0 - License is incompatible
 * @returns 0.5 - Could not determine compatibility
 * @returns 1 - License is compatible
 *
 */
export function licenseFunction<T>(repo: Repository<T>): number {
    const licenseName = repo.queryResult?.licenseInfo?.name;

    if (
        // Known compatible licenses
        licenseName == 'LGPL-2.1 License' ||
        licenseName == 'MIT License' ||
        licenseName == 'GNU Affero General Public License v3.0' ||
        licenseName == 'Mozilla Public License 2.0' ||
        licenseName == 'Artistic License 2.0' ||
        licenseName == 'BSD-2-Clause license' ||
        licenseName == 'BSD-3-Clause license' ||
        licenseName == 'GPL-2.0 license' ||
        licenseName == 'GPL-3.0 license' ||
        licenseName == 'EPL-2.0 license'
    ) {
        return 1;
    } else if (
        // Known incompatible licenses
        licenseName == 'Apache License 2.0' ||
        licenseName == 'CDDL-1.0 license'
    ) {
        return 0;
    } else if (licenseName == 'Other') {
        // If license is not found/specified
        return 0.5;
    } else {
        var answer;
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // Make sure to set API key in environment variables
        });

        try {
            openai.chat.completions
                .create({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'user',
                            content: `Is LGPL v2.1 compatible with ${licenseName}? Answer using yes or no`,
                        },
                    ],
                })
                .then((response) => {
                    answer = response.choices[0]?.message?.content;

                    if (answer == 'Yes' || answer == 'Yes.') {
                        return 1;
                    } else if (answer == 'No' || answer == 'No.') {
                        return 0;
                    } else {
                        return 0.5; // If no concrete answer can be found
                    }
                });
        } catch (error) {
            console.error('Error using API:', error);
        }
    }

    return 0;
}
