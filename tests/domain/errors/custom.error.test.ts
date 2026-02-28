import { CustomError } from "@domain/errors/custom.error";
import { Response } from "express";

describe('custom.error.ts tests', () => {

    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a CustomError intance from valid properties', () => {
        const statusCode = 400;
        const errorMsg = 'Testing error message';
        const error = new CustomError(statusCode, errorMsg);

        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toBe(errorMsg);
        expect(error.statusCode).toBe(statusCode);
    });

    test('CustomError should inherit instance of Error', () => {
        const error = new CustomError(400, 'Test error message');

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('Error');
    });

    test('badRequest() method should return a CustomError instance with statusCode 400', () => {
        const message = 'Testing bad request error';
        const error = CustomError.badRequest(message);

        expect(error.statusCode).toBe(400);
        expect(error.message).toBe(message);
    });

    test('unauthorized() method should return a CustomError instance with statusCode 401', () => {
        const message = 'Testing unauthorized error';
        const error = CustomError.unauthorized(message);

        expect(error.statusCode).toBe(401);
        expect(error.message).toBe(message);
    });

    test('forbidden() method should return a CustomError instance with statusCode 403', () => {
        const message = 'Testing forbidden error';
        const error = CustomError.forbidden(message);

        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(message);
    });

    test('notFound() method should return a CustomError instance with statusCode 404', () => {
        const message = 'Testing not found error';
        const error = CustomError.notFound(message);

        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(message);
    });

    test('internalServer() method should return a CustomError instance with statusCode 500', () => {
        const message = 'Testing internal server error';
        const error = CustomError.internalServer(message);

        expect(error.statusCode).toBe(500);
        expect(error.message).toBe(message);
    });

    describe('handleError() method', () => {
        test('should handle CustomError correctly', () => {
            const message = 'Testing handle error method';
            const error = CustomError.badRequest(message);

            CustomError.handleError(error, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: error.message}
            });
        });
        
        test('should handle generic error with 500', () => {
            const error = new Error('Internal error');
            const consoleLogSpy = jest.spyOn(console, 'log');

            CustomError.handleError(error, mockResponse as Response);

            expect(consoleLogSpy).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: {message: 'Internal server error'}
            });
        });
    });
});