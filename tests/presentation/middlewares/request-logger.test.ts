import {NextFunction, Request, Response} from 'express';
import {logger} from '@config/logger';
import {requestLogger} from '@presentation/middlewares/request-logger';

jest.mock('@config/logger', () => ({
    logger: {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    },
}));

describe('request-logger middleware tests', () => {
    const mockRequest: Partial<Request> = {method: 'GET', originalUrl: '/api/book'};
    const mockNextFn: NextFunction = jest.fn();

    let finishCallback: () => void = () => {};
    const mockResponse: Partial<Response> = {
        statusCode: 200,
        on: jest.fn().mockImplementation((_event: string, callback: () => void) => {
            finishCallback = callback;
            return mockResponse;
        }),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call next() and log info when status code is 200', () => {
        mockResponse.statusCode = 200;

        requestLogger(mockRequest as Request, mockResponse as Response, mockNextFn);
        finishCallback();

        expect(mockNextFn).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Request completed', {
            method: 'GET',
            url: '/api/book',
            statusCode: 200,
            durationMs: expect.any(Number),
        });
    });

    test('should call next() and log warn when status code is 400', () => {
        mockResponse.statusCode = 400;

        requestLogger(mockRequest as Request, mockResponse as Response, mockNextFn);
        finishCallback();

        expect(mockNextFn).toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith('Request completed', {
            method: 'GET',
            url: '/api/book',
            statusCode: 400,
            durationMs: expect.any(Number),
        });
    });

    test('should call next() and log error when status code is 500', () => {
        mockResponse.statusCode = 500;

        requestLogger(mockRequest as Request, mockResponse as Response, mockNextFn);
        finishCallback();

        expect(mockNextFn).toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith('Request completed', {
            method: 'GET',
            url: '/api/book',
            statusCode: 500,
            durationMs: expect.any(Number),
        });
    });
});
