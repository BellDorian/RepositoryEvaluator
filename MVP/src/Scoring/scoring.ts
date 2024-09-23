import { NDJSONRow, Repository } from '../Types/DataTypes';
import { licenseFunction } from './licenseFunction';
import { responsiveFunction } from './responsiveFunction';
import { scoreRampupTime } from './scoreRampupTime';
import { scoreBusFactor } from './scoreBusFactor';
import { scoreCorrectness } from './scoreCorrectness';
import { finalScore } from './finalScore';

function getLatencyInMs(startTime: [number, number]): number {
    const diff = process.hrtime(startTime); // [seconds, nanoseconds]
    return diff[0] * 1000 + diff[1] / 1e6; // Convert to milliseconds
}

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
    const netScoreStart = process.hrtime();
    const rampUpStart = process.hrtime();
    const rampup = scoreRampupTime(repo);
    const rampupLatency = getLatencyInMs(rampUpStart).toFixed(2);

    const correctnessStart = process.hrtime();
    const correctness = scoreCorrectness(repo);
    const correctnessLatency = getLatencyInMs(correctnessStart).toFixed(2);

    const busFactorStart = process.hrtime();
    const busFactor = 0; //scoreBusFactor(repo);
    const busFactorLatency = getLatencyInMs(busFactorStart).toFixed(2);

    const responsiveStart = process.hrtime();
    const responsive = responsiveFunction(repo);
    const responsiveLatency = getLatencyInMs(responsiveStart).toFixed(2);

    const licenseStart = process.hrtime();
    const license = licenseFunction(repo);
    const licenseLatency = getLatencyInMs(licenseStart).toFixed(2);

    const netScore = finalScore(repo, rampup, correctness, busFactor, responsive, license);
    const netScoreLatency = getLatencyInMs(netScoreStart).toFixed(2);
    return {
        ...repo,
        NDJSONRow: {
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
        },
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
export function scoreRepositoriesArray<Q>(repoArr: Repository<Q>[]): Repository<Q>[] {
    return repoArr.map(scoreRepository);
}
