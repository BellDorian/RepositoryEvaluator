import { QueryParams, Repository } from '../../Types/DataTypes';
import { defaultFields } from './constants';

/**
 * Builds a GraphQL query string based on the provided repository query information and optional extra fields.
 *
 * @param repoQueryInformation - An array of objects containing the owner and repository name for each query.
 * @param extraFields - An optional array of additional fields to include in the query.
 * @returns string - The constructed GraphQL query string.
 */
export const repoQueryBuilder = <T>(
    repoQueryInformation: Repository<T>[],
    extraFields?: string[]
): string => {
    return `
        query {
            ${repoQueryInformation
                .map((repo, idx) => {
                    return `
                repo${idx}: repository(owner: "${repo.owner}", name: "${repo.repoName}") {
                                ${[...defaultFields, ...(extraFields ?? [])].join('\n')}
                            }
                        `;
                })
                .join('\n')}
        }
    `;
};

export const buildRepoSchemaQuery = (): string => {
    return `
       query {
        __type(name: "Repository") {
                name
                kind
                description
                fields {
                    name
                }
            }
        }

    `;
};
