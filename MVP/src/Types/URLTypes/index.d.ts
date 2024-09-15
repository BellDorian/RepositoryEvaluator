// ==================== Types Tightly Couples With CleanURLSet ====================
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
