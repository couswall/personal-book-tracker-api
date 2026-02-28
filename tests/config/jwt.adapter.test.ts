import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@config/jwt.adapter';
import { CustomError } from '@domain/errors/custom.error';
import { ERROR_MESSAGES } from '@infrastructure/constants';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('jwt.adapter tests', () => {
    
    const mockToken = 'This is a mock token';
    const mockPayload = {
        id: 1,
        username: 'test_user',
        email: 'test@google.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('generateToken() should return a token', async () => {
        
        (jwt.sign as jest.Mock).mockImplementation(
            (payload, seed, options, callback) => callback(null, mockToken)
        );

        const result = await JwtAdapter.generateToken(mockPayload);

        expect(jwt.sign).toHaveBeenCalled();
        expect(result).toBe(mockToken);

    });

    test('generateToken() should resolve undefined if an error exists', async () => {

        (jwt.sign as jest.Mock).mockImplementation(
            (payload, seed, options, callback) => 
                callback(new Error('Error while generating token'))
        );

        const result = await JwtAdapter.generateToken(mockPayload);

        expect(result).toBeUndefined();
        expect(jwt.sign).toHaveBeenCalled();
    });

    test('validateToken() should return decoded payload', async () => {

        (jwt.verify as jest.Mock).mockImplementation(
            (token, seed, callback) => callback(null, mockPayload)
        );

        const result = await JwtAdapter.validateToken(mockToken);

        expect(jwt.verify).toHaveBeenCalled();
        expect(result).not.toBeUndefined();
        expect(result).toHaveProperty('id');
    });

    test('validateToken() should throw an error when token is invalid', async () => {

        (jwt.verify as jest.Mock).mockImplementation(
            (token, seed, callback) => 
                callback(new Error('Invalid token'))
        );

        await expect(JwtAdapter.validateToken(mockToken))
            .rejects.toThrow(CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID))
    });
});