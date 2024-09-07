import { describe, expect, it } from '@jest/globals';
import { mockUrls } from '../TestUtils/constants';
import { transformToNDJSONRow, transformToNDJSONRows } from './NDJSON';

describe('NDJSON Transformer', () => {
    mockUrls.forEach((url) => {
        it(`should build a row with the url ${url}`, () => {
            const row = transformToNDJSONRow(url);
            expect(row.URL).toBe(url);
        });
    });

    it('Should build rows with urls', () => {
        const rows = transformToNDJSONRows(mockUrls);
        rows.forEach((row) => {
            expect(mockUrls.includes(row.URL ? row.URL : '')).toBe(true);
        });
    });
});
