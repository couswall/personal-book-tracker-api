import {Request, Response} from 'express';
import {prisma} from '@src/data/postgres';
import {BCryptAdapter, JwtAdapter} from '@src/config';
import {AuthController} from '@presentation/auth/controller';
import {UserDatasourceImpl} from '@infrastructure/datasources/user.datasource.impl';
import {UserRepositoryImpl} from '@infrastructure/repositories/user.repository.impl';
import {
    bookshelfPrisma,
    createUserDtoObj,
    loginUserDtoObj,
    mockUserPrisma,
} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

jest.mock('@data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
        bookshelf: {
            createMany: jest.fn(),
        },
    },
}));
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

describe('auth controller tests', () => {
    const datasource = new UserDatasourceImpl();
    const repository = new UserRepositoryImpl(datasource);
    const authController = new AuthController(repository);

    let mockRequest: Partial<Request> = {
        body: {},
        params: {},
    };
    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    const mockToken = 'any-token';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('loginUser() tests', () => {
        test('should return a 200 status, user data and token when loggin succeds', async () => {
            mockRequest.body = {...loginUserDtoObj};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
            (BCryptAdapter.compare as jest.Mock).mockReturnValue(true);
            (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(mockToken);

            await new Promise<void>((resolve) => {
                authController.loginUser(
                    mockRequest as Request,
                    mockResponse as Response
                );
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
        });
        test('should throw a 400 error status when body request is empty', async () => {
            mockRequest.body = {};

            await authController.loginUser(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: expect.any(String)},
            });
        });
        test('should throw a 400 error status when user does not exist', async () => {
            mockRequest.body = {...loginUserDtoObj};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await new Promise<void>((resolve) => {
                authController.loginUser(
                    mockRequest as Request,
                    mockResponse as Response
                );
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

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
            (BCryptAdapter.compare as jest.Mock).mockReturnValue(false);

            await new Promise<void>((resolve) => {
                authController.loginUser(
                    mockRequest as Request,
                    mockResponse as Response
                );
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ERROR_MESSAGES.USER.LOGIN.INVALID_CREDENTIALS},
            });
        });
    });
    describe('registerUser() tests', () => {
        test('should return a 201 status, user data and token when created successfully', async () => {
            mockRequest.body = {...createUserDtoObj};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(mockUserPrisma);
            (prisma.bookshelf.createMany as jest.Mock).mockResolvedValue([
                bookshelfPrisma,
            ]);
            (BCryptAdapter.hash as jest.Mock).mockReturnValue('hashed-password');
            (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(mockToken);

            await new Promise<void>((resolve) => {
                authController.registerUser(
                    mockRequest as Request,
                    mockResponse as Response
                );
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
                authController.registerUser(
                    mockRequest as Request,
                    mockResponse as Response
                );
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
                authController.registerUser(
                    mockRequest as Request,
                    mockResponse as Response
                );
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ERROR_MESSAGES.USER.CREATE.EXISTING_EMAIL},
            });
        });
    });
});
