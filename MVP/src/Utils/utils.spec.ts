import { describe, expect, test } from '@jest/globals';
import { pluralizeText } from './utils';

interface TestData<T> {
    [key: string]: { arr: T[]; text: string; expected: string };
}

const testData: TestData<number> = {
    'plural text when array has multiple items': {
        arr: [1, 2, 3],
        text: 'text',
        expected: 'texts',
    },
    'un-pluralized text when array has one item': {
        arr: [1],
        text: 'text',
        expected: 'text',
    },
    'un-pluralized text when array has no items': {
        arr: [],
        text: 'text',
        expected: 'text',
    },
};

describe('Utils', () => {
    Object.entries(testData).map(([key, value]) => {
        test(`Pluralize text should create ${key}`, () => {
            expect(pluralizeText(value.arr, value.text)).toBe(value.expected);
        });
    });
});
