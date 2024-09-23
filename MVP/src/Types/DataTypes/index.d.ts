export type NDJSONRow = Partial<{
    URL: string;
    NetScore: number;
    NetScore_Latency: string;
    RampUp: number;
    RampUp_Latency: string;
    Correctness: number;
    Correctness_Latency: string;
    BusFactor: number;
    BusFactor_Latency: string;
    ResponsiveMaintainer: number;
    ResponsiveMaintainer_Latency: string;
    License: number;
    License_Latency: string;
}>;

export type NDJSONRows = NDJSONRow[];

export type QueryParams = { owner: string; repoName: string };

export type ResultType<T> = {
    [key: `repo${number}`]: T;
};

export type Repository<T> = {
    owner: string;
    repoName: string;
    description?: string;
    repoUrl?: string;
    fileUrl: string;
    queryResult:
        | ({
              name: string;
              url: string;
              description: string;
              licenseInfo?: {
                  name: string;
              };
              openIssues?: {
                  totalCount: number;
              };
              closedIssues?: {
                  totalCount: number;
              };
              stargazerCount?: number;
              licenseInfo?: { name?: string };
          } & T)
        | null;
    NDJSONRow: NDJSONRow;
};
