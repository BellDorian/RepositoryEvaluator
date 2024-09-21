import { Repository, NDJSONRow } from '../Types/DataTypes';
import { licenseFunction } from './licenseFunction';
import { responsiveFunction } from './responsiveFunction';
import { scoreRampupTime } from './scoreRampupTime';
import { scoreBusFactor } from './scoreBusFactor';
import { scoreCorrectness } from './scoreCorrectness';
import { finalScore } from './finalScore';

/**
 * @author Jorge Puga Hernandez
 * @description - Scores a repository by calling the metric functions created by various team members.
 * The time taken to calculate each metric is recorded in milliseconds and converted into seconds.
 *
 * @template T - The type of the data stored in the repository (generic).
 * @param repo - The repository that must be scored.
 * @returns An updated repository with the calculated metrics and their respective latencies. {@type Repository<T>}
 *
 */
export function scoreRepository<T>(repo: Repository<T>): Repository<T> {
    const rampUpStart = Date.now();
    const rampup = scoreRampupTime(repo);
    const rampupLatency = Math.round(((Date.now() - rampUpStart) / 1000) * 1000) / 1000;

    const correctnessStart = Date.now();
    const correctness = scoreCorrectness(repo);
    const correctnessLatency = Math.round(((Date.now() - correctnessStart) / 1000) * 1000) / 1000;

    const busFactorStart = Date.now();
    const busFactor = scoreBusFactor(repo);
    const busFactorLatency = Math.round(((Date.now() - busFactorStart) / 1000) * 1000) / 1000;

    const responsiveStart = Date.now();
    const responsive = responsiveFunction(repo);
    const responsiveLatency = Math.round(((Date.now() - responsiveStart) / 1000) * 1000) / 1000;

    const licenseStart = Date.now();
    const license = licenseFunction(repo);
    const licenseLatency = Math.round(((Date.now() - licenseStart) / 1000) * 1000) / 1000;

    const netScoreStart = Date.now();
    const netScore = finalScore(repo, rampup, correctness, busFactor, responsive, license);
    const netScoreLatency = Math.round(((Date.now() - netScoreStart) / 1000) * 1000) / 1000;

    const updatedNDJSONRow: NDJSONRow = {
        ...repo.NDJSONRow,
        NetScore: netScore,
        NetScore_Latency: netScoreLatency,
        RampUp: rampup,
        RampUp_Latency: rampupLatency,
        Correctness: correctness,
        Correctness_Latency: correctnessLatency,
        BusFactor: busFactor,
        BusFactor_Latency: busFactorLatency,
        ResponsiveMaintainer: responsive,
        ResponsiveMaintainer_Latency: responsiveLatency,
        License: license,
        License_Latency: licenseLatency,
    };

    return {
        ...repo,
        NDJSONRow: updatedNDJSONRow,
    };
}

/**
 * @author Jorge Puga Hernandez
 *
 * @description - Scores an array of repositories by using the map function to
 * apply the 'scorerRepository' function to each repository in the array.
 *
 * @template T - The type of the data stored in each repository.
 * @param repoArr - Array of repositories to score. {@type Repository<T>[]}
 * @returns An updated repository with the calculated metrics and their respective latencies. {@type Repository<T>[]}
 *
 */
export function scoreRepositoriesArray<T>(repoArr: Repository<T>[]): Repository<T>[] {
    return repoArr.map(scoreRepository);
}
