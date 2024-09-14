export const createLanguagesField = (first: number) => `
    languages(first: ${first}) {
        nodes {
            name
        }
    }
`;

export const createVulnerabilityAlertsField = (first: number) => `
    vulnerabilityAlerts(first: ${first}) {
        nodes {
            securityAdvisory {
                severity
            }
        }
    }
`;

export const createReactionsField = (first: number) => `
    reactions: issues(first: ${first}) {
        nodes {
            reactions(first: 5) {
                nodes {
                    content
                    user {
                        login
                    }
                }
            }
        }
    }
`;

export const createIssuesField = (first: number) => `
    openIssues: issues(states:OPEN) {
        totalCount
    }
    closedIssues: issues(states:CLOSED) {
        totalCount
    }
`;
