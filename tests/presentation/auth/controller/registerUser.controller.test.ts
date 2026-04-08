import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {BCryptAdapter, JwtAdapter} from '@src/config';
import {createAuthControllerSetup} from './setup';
import {bookshelfPrisma, createUserDtoObj, mockUserPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

jest.mock('@config/bcrypt.adapter', () => ({
    BCryptAdapter: {
        compare: jest.fn(),
        hash: jest.fn(),
    },
}));
jest.mock('@config/jwt.adapter', () => ({
    JwtAdapter: {
        generateToken: jest.fn(),
    },
}));

describe('AuthController.registerUser tests', () => {
    const {authController, mockRequest, mockResponse} = createAuthControllerSetup();
    const mockToken = 'any-token';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 201 status, user data and token when created successfully', async () => {
        mockRequest.body = {...createUserDtoObj};

        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.user.create as jest.Mock).mockResolvedValue(mockUserPrisma);
        (prisma.bookshelf.createMany as jest.Mock).mockResolvedValue([bookshelfPrisma]);
        (BCryptAdapter.hash as jest.Mock).mockReturnValue('hashed-password');
        (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(mockToken);

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

        (prisma.user.findFirst as jest.Mock)
            .mockResolvedValueOnce(mockUserPrisma)
            .mockResolvedValue(null);
        (BCryptAdapter.hash as jest.Mock).mockReturnValue('hashed-password');
        (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(mockToken);

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

        (prisma.user.findFirst as jest.Mock)
            .mockResolvedValueOnce(null)
            .mockResolvedValue(mockUserPrisma);
        (BCryptAdapter.hash as jest.Mock).mockReturnValue('hashed-password');
        (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(mockToken);

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
