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

    it('Should log an error when an error is thrown', () => {
        const mockFunction = jest.fn(() => {
            throw new Error('Test error for ErrorWrapper');
        });

        try {
            ErrorWrapper(mockFunction, 'Testing ErrorWrapper without returns');
        } catch (err) {}

        expect(exitSpy).toBeCalledWith(1);
    });
});
