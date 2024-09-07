import { scoreRepository } from './scoring';
import { Repository, NDJSONRow } from '../Types/DataTypes'

type FinalScore = {
    rampup: number; // Currently will be based on number of stars a project has
    correctness: number; // Based on total issues divided by open issues
    busFactor: number; // Based on number of contributors and contributions
    responsive: number; // Unknown, assigned to someone else
    license: number; // Think we are using an LLM for this
    finalScore: number; // Final score
}
export function scoreTest() {
    // Everything below here is testing
    /*const repo: Repository<any> = {
        owner: "bkanter-purdue",
        repoName: "Ben_SoftwareEng_Fall2024",
        description?: "NOTHING!!!",
        repoUrl?: "https://github.com/bkanter-purdue/Ben_SoftwareEng_Fall2024/",
        fileUrl: "string",
        queryResult: ({
            name: "queryName",
            url: "https://github.com/bkanter-purdue/Ben_SoftwareEng_Fall2024/",
            description: "Description";
        } & T) | null;
    } */

    //scoreRepository(repo);

};