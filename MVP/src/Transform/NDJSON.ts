import { NDJSONRow, NDJSONRows } from '../Types/DataTypes';

export const transformToNDJSONRow = (url: string): NDJSONRow => ({
    URL: url,
    NetScore: 0,
    NetScore_Latency: 0,
    RampUp: 0,
    RampUp_Latency: 0,
    Correctness: 0,
    Correctness_Latency: 0,
    BusFactor: 0,
    BusFactor_Latency: 0,
    ResponsiveMaintainer: 0,
    ResponsiveMaintainer_Latency: 0,
    License: 0,
    License_Latency: 0,
});

export const transformToNDJSONRows = (urls: string[]): NDJSONRows =>
    urls.map((url) => transformToNDJSONRow(url));
