// Scoring file that will contain individual metric calculation functions written by the team.
// Date.now() is used to time the latency of the metric calculation. It is converted to seconds
// and rounded to the nearest millisecond.

import { Repository, NDJSONRow } from './Types/DataTypes'
//import { rampupFunction, correctnessFunction, busFactorFunction, responsiveFunction, licenseFunction } from './wherever they are'

export function scoreRepository<T>(repo: Repository<T>): Repository<T> {

  const rampUpStart = Date.now()
  const rampup = 1 // rampupFunction(repo) goes here.
  const rampupLatency = Math.round((Date.now() - rampUpStart)/1000 * 1000) / 1000

  const correctnessStart = Date.now()
  const correctness = 2 //correctnessFunction(repo) goes here.
  const correctnessLatency = Math.round((Date.now() - correctnessStart)/1000 * 1000) / 1000

  const busFactorStart = Date.now()
  const busFactor = 3 //busFactorFunction(repo) goes here.
  const busFactorLatency = Math.round((Date.now() - busFactorStart)/1000 * 1000) / 1000

  const responsiveStart = Date.now()
  const responsive = 4 //responsiveFunction(repo) goes here.
  const responsiveLatency = Math.round((Date.now() - responsiveStart)/1000 * 1000) / 1000

  const licenseStart = Date.now()
  const license = 5 //licenseFunction(repo) goes here.
  const licenseLatency = Math.round((Date.now() - licenseStart)/1000 * 1000) / 1000

  const netScoreStart = Date.now()
  const netScore = 1 // must arrive at a conclusion for calculating this. Which metrics are more meaningful? Could weigh based on importance.
  const netScoreLatency = Math.round((Date.now() - netScoreStart)/1000 * 1000) / 1000

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
    License_Latency: licenseLatency
  }

  return{
    ...repo,
    NDJSONRow: updatedNDJSONRow
  }

}

// Scores the repo array.
// Using the map function to apply calculations to each repo in the array.
// Will return an updated array after applying the teams metric functions.
export function scoreRepositoriesArray<T>(repoArr: Repository<T>[]): Repository<T>[]{
  return repoArr.map(scoreRepository)
}