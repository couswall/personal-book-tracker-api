import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {BCryptAdapter, JwtAdapter} from '@src/config';
import {createAuthControllerSetup} from './setup';
import {loginUserDtoObj, mockUserPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {
    REFRESH_COOKIE_NAME,
    refreshCookieOptions,
} from '@presentation/auth/cookie-options';

jest.mock('@config/bcrypt.adapter', () => ({
    BCryptAdapter: {
        compare: jest.fn(),
        hash: jest.fn(),
    },
}));
jest.mock('@config/jwt.adapter', () => ({
    JwtAdapter: {
        generateAccessToken: jest.fn(),
        generateRefreshToken: jest.fn(),
    },
}));

describe('AuthController.loginUser tests', () => {
    const {authController, mockRequest, mockResponse} = createAuthControllerSetup();
    const mockToken = 'any-token';
    const mockRefreshToken = 'any-refresh-token';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 200 status, user data and token when login succeeds', async () => {
        mockRequest.body = {...loginUserDtoObj};

        jest.mocked(prisma.user.findFirst).mockResolvedValue(mockUserPrisma);
        jest.mocked(BCryptAdapter.compare).mockReturnValue(true);
        jest.mocked(JwtAdapter.generateAccessToken).mockResolvedValue(mockToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(mockRefreshToken);

        await new Promise<void>((resolve) => {
            authController.loginUser(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Login successfully',
            data: expect.objectContaining({
                user: expect.any(Object),
                token: mockToken,
            }),
        });
        expect(mockResponse.cookie).toHaveBeenCalledWith(
            REFRESH_COOKIE_NAME,
            mockRefreshToken,
            refreshCookieOptions
        );
    });

    test('should throw a 400 error status when body request is empty', async () => {
        mockRequest.body = {};

        await new Promise<void>((resolve) => {
            authController.loginUser(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: expect.any(String)},
        });
    });

    test('should throw a 400 error status when user does not exist', async () => {
        mockRequest.body = {...loginUserDtoObj};

        jest.mocked(prisma.user.findFirst).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            authController.loginUser(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS},
        });
    });

    test('should throw a 400 error status if password is invalid', async () => {
        mockRequest.body = {...loginUserDtoObj};

        jest.mocked(prisma.user.findFirst).mockResolvedValue(mockUserPrisma);
        jest.mocked(BCryptAdapter.compare).mockReturnValue(false);

        await new Promise<void>((resolve) => {
            authController.loginUser(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS},
        });
    });
});
