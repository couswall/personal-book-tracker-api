import jwt from 'jsonwebtoken';
import {JwtAdapter} from '@config/jwt.adapter';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('jwt.adapter tests', () => {
    const mockToken = 'This is a mock token';
    const mockPayload = {id: 1};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateToken() should return a token', async () => {
        (jwt.sign as jest.Mock).mockImplementation((payload, seed, options, callback) =>
            callback(null, mockToken)
        );

        const result = await JwtAdapter.generateToken(mockPayload);

        expect(jwt.sign).toHaveBeenCalled();
        expect(result).toBe(mockToken);
    });

    test('generateToken() should resolve undefined if an error exists', async () => {
        (jwt.sign as jest.Mock).mockImplementation((payload, seed, options, callback) =>
            callback(new Error('Error while generating token'))
        );

        const result = await JwtAdapter.generateToken(mockPayload);

        expect(result).toBeUndefined();
        expect(jwt.sign).toHaveBeenCalled();
    });

    test('validateToken() should return decoded payload', async () => {
        (jwt.verify as jest.Mock).mockImplementation((token, seed, options, callback) =>
            callback(null, mockPayload)
        );

        const result = await JwtAdapter.validateToken(mockToken);

        expect(jwt.verify).toHaveBeenCalled();
        expect(result).not.toBeUndefined();
        expect(result).toHaveProperty('id');
    });

    test('validateToken() should throw an error when token is invalid', async () => {
        (jwt.verify as jest.Mock).mockImplementation((token, seed, options, callback) =>
            callback(new Error('Invalid token'))
        );

        await expect(JwtAdapter.validateToken(mockToken)).rejects.toThrow(
            CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
        );
    });
});

describe('jwt.adapter security settings', () => {
    beforeEach(() => jest.clearAllMocks());

    test('generateToken() should sign with HS256 and only the user id', async () => {
        (jwt.sign as jest.Mock).mockImplementation((payload, seed, options, callback) =>
            callback(null, 'token')
        );

        await JwtAdapter.generateToken({id: 1});

        expect(jwt.sign).toHaveBeenCalledWith(
            {id: 1},
            expect.any(String),
            expect.objectContaining({algorithm: 'HS256'}),
            expect.any(Function)
        );
    });

    test('validateToken() should only accept HS256 tokens', async () => {
        (jwt.verify as jest.Mock).mockImplementation((token, seed, options, callback) =>
            callback(null, {id: 1})
        );

        await JwtAdapter.validateToken('token');

        expect(jwt.verify).toHaveBeenCalledWith(
            'token',
            expect.any(String),
            {algorithms: ['HS256']},
            expect.any(Function)
        );
    });

    test.each([
        ['a missing id', {username: 'test'}],
        ['a non-numeric id', {id: '1'}],
        ['a string payload', 'not-an-object'],
    ])('validateToken() should reject a payload with %s', async (_label, decoded) => {
        (jwt.verify as jest.Mock).mockImplementation((token, seed, options, callback) =>
            callback(null, decoded)
        );

        await expect(JwtAdapter.validateToken('token')).rejects.toThrow(
            CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
        );
    });

    test('validateToken() should still accept legacy tokens carrying username and email', async () => {
        const legacyPayload = {id: 1, username: 'test_user', email: 'test@google.com'};
        (jwt.verify as jest.Mock).mockImplementation((token, seed, options, callback) =>
            callback(null, legacyPayload)
        );

        await expect(JwtAdapter.validateToken('token')).resolves.toHaveProperty('id', 1);
    });
});
