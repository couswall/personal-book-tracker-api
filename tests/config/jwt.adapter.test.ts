import {JwtAdapter} from '@config/jwt.adapter';
import {CustomError} from '@domain/errors/custom.error';
import {envs} from '@config/envs';
import {ERROR_MESSAGES} from '@infrastructure/constants';

const mockSign = jest.fn();
const mockVerify = jest.fn();

jest.mock('jsonwebtoken', () => ({
    sign: (...args: unknown[]) => mockSign(...args),
    verify: (...args: unknown[]) => mockVerify(...args),
}));

describe('jwt.adapter tests', () => {
    const mockToken = 'This is a mock token';
    const mockPayload = {id: 1};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateAccessToken() should return a token', async () => {
        mockSign.mockImplementation((payload, seed, options, callback) =>
            callback(null, mockToken)
        );

        const result = await JwtAdapter.generateAccessToken(mockPayload);

        expect(mockSign).toHaveBeenCalled();
        expect(result).toBe(mockToken);
    });

    test('generateAccessToken() should resolve undefined if an error exists', async () => {
        mockSign.mockImplementation((payload, seed, options, callback) =>
            callback(new Error('Error while generating token'))
        );

        const result = await JwtAdapter.generateAccessToken(mockPayload);

        expect(result).toBeUndefined();
        expect(mockSign).toHaveBeenCalled();
    });

    test('validateAccessToken() should return decoded payload', async () => {
        mockVerify.mockImplementation((token, seed, options, callback) =>
            callback(null, mockPayload)
        );

        const result = await JwtAdapter.validateAccessToken(mockToken);

        expect(mockVerify).toHaveBeenCalled();
        expect(result).not.toBeUndefined();
        expect(result).toHaveProperty('id');
    });

    test('validateAccessToken() should throw an error when token is invalid', async () => {
        mockVerify.mockImplementation((token, seed, options, callback) =>
            callback(new Error('Invalid token'))
        );

        await expect(JwtAdapter.validateAccessToken(mockToken)).rejects.toThrow(
            CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
        );
    });

    test('generateRefreshToken() should return a token', async () => {
        mockSign.mockImplementation((payload, seed, options, callback) =>
            callback(null, mockToken)
        );

        const result = await JwtAdapter.generateRefreshToken(mockPayload);

        expect(mockSign).toHaveBeenCalled();
        expect(result).toBe(mockToken);
        expect(mockSign).toHaveBeenCalledWith(
            mockPayload,
            envs.JWT_REFRESH_SEED,
            expect.objectContaining({expiresIn: '7d'}),
            expect.any(Function)
        );
    });

    test('validateRefreshToken() should return decoded payload', async () => {
        mockVerify.mockImplementation((token, seed, options, callback) =>
            callback(null, mockPayload)
        );

        const result = await JwtAdapter.validateRefreshToken(mockToken);

        expect(mockVerify).toHaveBeenCalled();
        expect(result).not.toBeUndefined();
        expect(result).toHaveProperty('id');
        expect(mockVerify).toHaveBeenCalledWith(
            mockToken,
            envs.JWT_REFRESH_SEED,
            expect.anything(),
            expect.any(Function)
        );
    });

    test('validateRefreshToken() should throw an error when token is invalid', async () => {
        mockVerify.mockImplementation((token, seed, options, callback) =>
            callback(new Error('Invalid token'))
        );

        await expect(JwtAdapter.validateRefreshToken(mockToken)).rejects.toThrow(
            CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
        );
    });
});

describe('jwt.adapter security settings', () => {
    beforeEach(() => jest.clearAllMocks());

    test('generateAccessToken() should sign with HS256 and only the user id', async () => {
        mockSign.mockImplementation((payload, seed, options, callback) =>
            callback(null, 'token')
        );

        await JwtAdapter.generateAccessToken({id: 1});

        expect(mockSign).toHaveBeenCalledWith(
            {id: 1},
            expect.any(String),
            expect.objectContaining({algorithm: 'HS256'}),
            expect.any(Function)
        );
    });

    test('validateAccessToken() should only accept HS256 tokens', async () => {
        mockVerify.mockImplementation((token, seed, options, callback) =>
            callback(null, {id: 1})
        );

        await JwtAdapter.validateAccessToken('token');

        expect(mockVerify).toHaveBeenCalledWith(
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
    ])(
        'validateAccessToken() should reject a payload with %s',
        async (_label, decoded) => {
            mockVerify.mockImplementation((token, seed, options, callback) =>
                callback(null, decoded)
            );

            await expect(JwtAdapter.validateAccessToken('token')).rejects.toThrow(
                CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID)
            );
        }
    );

    test('validateAccessToken() should still accept legacy tokens carrying username and email', async () => {
        const legacyPayload = {id: 1, username: 'test_user', email: 'test@google.com'};
        mockVerify.mockImplementation((token, seed, options, callback) =>
            callback(null, legacyPayload)
        );

        await expect(JwtAdapter.validateAccessToken('token')).resolves.toHaveProperty(
            'id',
            1
        );
    });
});
