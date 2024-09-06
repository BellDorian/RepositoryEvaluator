import { describe, it } from '@jest/globals';
import { NDJSONRow } from '../Types/DataTypes';

const NDJSONRow: NDJSONRow = {
    URL: 'https://someurl.com/',
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
};

const NDJSONRows = [NDJSONRow, NDJSONRow, NDJSONRow];

describe('CLI Output', () => {
    it('Should delimit output with newlines', () => {});
});
