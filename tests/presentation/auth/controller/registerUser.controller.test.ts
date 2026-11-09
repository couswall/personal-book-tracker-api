import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {BCryptAdapter, JwtAdapter} from '@src/config';
import {createAuthControllerSetup} from './setup';
import {createUserDtoObj, mockUserPrisma} from '@tests/fixtures';
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
        generateToken: jest.fn(),
        generateRefreshToken: jest.fn(),
    },
}));

describe('AuthController.registerUser tests', () => {
    const {authController, mockRequest, mockResponse} = createAuthControllerSetup();
    const mockToken = 'any-token';
    const mockRefreshToken = 'any-refresh-token';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 201 status, user data and token when created successfully', async () => {
        mockRequest.body = {...createUserDtoObj};

        jest.mocked(prisma.user.findFirst).mockResolvedValue(null);
        jest.mocked(prisma.user.create).mockResolvedValue(mockUserPrisma);
        jest.mocked(prisma.bookshelf.createMany).mockResolvedValue({count: 1});
        jest.mocked(BCryptAdapter.hash).mockReturnValue('hashed-password');
        jest.mocked(JwtAdapter.generateToken).mockResolvedValue(mockToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(mockRefreshToken);

        await new Promise<void>((resolve) => {
            authController.registerUser(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'User created successfully',
            data: {
                user: expect.any(Object),
                token: mockToken,
            },
        });
        expect(mockResponse.cookie).toHaveBeenCalledWith(
            REFRESH_COOKIE_NAME,
            mockRefreshToken,
            refreshCookieOptions
        );
    });

    test('should throw a 400 error status when body request is empty', async () => {
        mockRequest.body = {};

        authController.registerUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: expect.any(String)},
        });
    });

    test('should throw a 400 error status if username already exists', async () => {
        mockRequest.body = {...createUserDtoObj};

        jest.mocked(prisma.user.findFirst)
            .mockResolvedValueOnce(mockUserPrisma)
            .mockResolvedValue(null);

        jest.mocked(BCryptAdapter.hash).mockReturnValue('hashed-password');
        jest.mocked(JwtAdapter.generateToken).mockResolvedValue(mockToken);

        await new Promise<void>((resolve) => {
            authController.registerUser(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.USER.CREATE.EXISTING_USERNAME},
        });
    });

    test('should throw a 400 error status if email already exists', async () => {
        mockRequest.body = {...createUserDtoObj};

        jest.mocked(prisma.user.findFirst)
            .mockResolvedValueOnce(null)
            .mockResolvedValue(mockUserPrisma);

        jest.mocked(BCryptAdapter.hash).mockReturnValue('hashed-password');
        jest.mocked(JwtAdapter.generateToken).mockResolvedValue(mockToken);

        await new Promise<void>((resolve) => {
            authController.registerUser(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.USER.CREATE.EXISTING_EMAIL},
        });
    });
});
