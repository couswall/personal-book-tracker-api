import {Response} from 'express';
import {requireAuthUserId} from '@presentation/helpers/auth.helpers';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {createMockResponse} from '@tests/setup';

describe('requireAuthUserId() tests', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockResponse = createMockResponse();
    });

    test('should return the userId set by validateJWT', () => {
        mockResponse.locals = {userId: 7};

        const result = requireAuthUserId(mockResponse as Response);

        expect(result).toBe(7);
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    test.each([
        ['missing', {}],
        ['not a number', {userId: '7'}],
    ])('should send a 401 and return undefined when userId is %s', (_label, locals) => {
        mockResponse.locals = locals;

        const result = requireAuthUserId(mockResponse as Response);

        expect(result).toBeUndefined();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.TOKEN.INVALID},
        });
    });
});
