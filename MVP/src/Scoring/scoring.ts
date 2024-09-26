import { NDJSONRow, Repository } from '../Types/DataTypes';
import { licenseFunction } from './licenseFunction';
import { responsiveFunction } from './responsiveFunction';
import { scoreRampupTime } from './scoreRampupTime';
import { scoreBusFactor } from './scoreBusFactor';
import { scoreCorrectness } from './scoreCorrectness';
import { finalScore } from './finalScore';
import { LogInfo } from '../Utils/log';

function getLatencyInMs(startTime: [number, number]): number {
    const diff = process.hrtime(startTime); // [seconds, nanoseconds]
    return diff[0] * 1000 + diff[1] / 1e6; // Convert to milliseconds
}

const ensureNetNotLessOrMore = (
    rampUp: number,
    correctness: number,
    busFactor: number,
    responsive: number,
    license: number,
    netScore: number,
    maxOrMin: 'max' | 'min'
): { newNet: number; netChanged: boolean } => {
    const compare =
        maxOrMin === 'min'
            ? Math.min(netScore, rampUp, correctness, busFactor, responsive, license)
            : Math.max(netScore, rampUp, correctness, busFactor, responsive, license);
    if (maxOrMin === 'max' && compare > netScore) {
        return { newNet: compare, netChanged: true };
    }
    if (maxOrMin === 'min' && compare < netScore) {
        return { newNet: compare, netChanged: true };
    }
    return { newNet: netScore, netChanged: false };
};

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
export async function scoreRepository<T>(repo: Repository<T>): Promise<Repository<T>> {
    const netScoreStart = process.hrtime();
    const rampUpStart = process.hrtime();
    const rampup = scoreRampupTime(repo);
    const rampupLatency = getLatencyInMs(rampUpStart);

    const correctnessStart = process.hrtime();
    const correctness = scoreCorrectness(repo);
    const correctnessLatency = getLatencyInMs(correctnessStart);

    const busFactorStart = process.hrtime();
    const busFactor = await scoreBusFactor(repo);
    const busFactorLatency = getLatencyInMs(busFactorStart);

    const responsiveStart = process.hrtime();
    const responsive = responsiveFunction(repo);
    const responsiveLatency = getLatencyInMs(responsiveStart);

    const licenseStart = process.hrtime();
    const license = licenseFunction(repo);
    const licenseLatency = getLatencyInMs(licenseStart);

    let netScore = finalScore(repo, rampup, correctness, busFactor, responsive, license);
    const netScoreLatency = getLatencyInMs(netScoreStart);
    netScore = ensureNetNotLessOrMore(
        rampup,
        correctness,
        busFactor,
        responsive,
        license,
        netScore,
        'max'
    ).newNet;
    netScore = ensureNetNotLessOrMore(
        rampup,
        correctness,
        busFactor,
        responsive,
        license,
        netScore,
        'min'
    ).newNet;

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
export async function scoreRepositoriesArray<Q>(repoArr: Repository<Q>[]): Promise<Repository<Q>[]> {
    let repoBuilder: Repository<Q>[] = [];
    for (const repo of repoArr) {
        const scoredRepo = await scoreRepository(repo);
        repoBuilder.push(scoredRepo);
    }
    return repoBuilder;
}
