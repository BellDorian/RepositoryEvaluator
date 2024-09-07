import { createLanguagesField, createReactionsField, createVulnerabilityAlertsField } from './fields';

export const defaultFields = [
    'description',
    'name',
    'url',
    `owner {
        login
    }`,
];

export const extraFields = [
    'name',
    `owner {
        login
    }`,
    'stargazerCount',
    'forkCount',
    'updatedAt',
    'pushedAt',
    'isPrivate',
    'isFork',
    `watchers {
        totalCount
    }`,
    `licenseInfo {
        name
        spdxId
        url
    }`,
    `primaryLanguage {
        name
    }`,
    createLanguagesField(10),
    createVulnerabilityAlertsField(10),
    createReactionsField(10),
];
