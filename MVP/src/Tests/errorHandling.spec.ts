import { ErrorWrapper, ErrorWrapperForReturns, ErrorWrapperForAsync } from '../Utils/errorHandling';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('ErrorWrapper Tests', () => {
    let exitSpy: any;
    beforeEach(() => {
        jest.resetAllMocks();
        exitSpy = jest
            .spyOn(process, 'exit')
            .mockImplementation((code?: string | number | null | undefined) => undefined as never);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('ErrorWrapper should log an error when an error is thrown', () => {
        const mockFunction = jest.fn(() => {
            throw new Error('Test error for ErrorWrapper');
        });

        try {
            ErrorWrapper(mockFunction, 'Testing ErrorWrapper without returns');
        } catch (err) {}

        expect(exitSpy).toBeCalledWith(1);
    });
});

describe('ErrorWrapperForReturns Tests', () => {
    let exitSpy: any;
    beforeEach(() => {
        jest.resetAllMocks();
        exitSpy = jest
            .spyOn(process, 'exit')
            .mockImplementation((code?: string | number | null | undefined) => undefined as never);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('ErrorWrapperForReturns should log an error when an error is thrown', () => {
        const mockFunction = jest.fn(() => {
            throw new Error('Test error for ErrorWrapperForReturns');
        });

        try {
            ErrorWrapperForReturns(mockFunction, 'Testing ErrorWrapperForReturns');
        } catch (err) {}

        expect(exitSpy).toBeCalledWith(1);
    });

    it('ErrorWrapperForReturns should return a valid result when no error is thrown', () => {
        const mockFunction = jest.fn((a: number, b: number) => a * b);
        const result = ErrorWrapperForReturns(mockFunction, 'No Error Should Occur', 2, 5);

        expect(result).toBe(10);
        expect(exitSpy).not.toBeCalled();
    });
});

describe('ErrorWrapperForAsync Tests', () => {
    let exitSpy: any;
    beforeEach(() => {
        jest.resetAllMocks();
        exitSpy = jest
            .spyOn(process, 'exit')
            .mockImplementation((code?: string | number | null | undefined) => undefined as never);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('ErrorWrapperForAsync should log an error when an error is thrown', async () => {
        const mockFunction = jest.fn(async () => {
            throw new Error('Test error for ErrorWrapperForAsync');
        });

        try {
            await ErrorWrapperForAsync(mockFunction, 'Testing ErrorWrapperForAsync');
        } catch (err) {}

        expect(exitSpy).toBeCalledWith(1);
    });

    it('ErrorWrapperForAsync should return a valid result when no error is thrown', async () => {
        const mockFunction = jest.fn(async (a: number, b: number) => a * b);
        const result = await ErrorWrapperForAsync(mockFunction, 'No Error Should Occur', 5, 5);

        expect(result).toBe(25);
        expect(exitSpy).not.toBeCalled();
    });
});
