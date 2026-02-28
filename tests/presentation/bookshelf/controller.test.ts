import {Request, Response} from 'express';
import {prisma} from '@data/postgres';
import {BookshelfController} from '@presentation/bookshelf/controller';
import {UserDatasourceImpl} from '@infrastructure/datasources/user.datasource.impl';
import {UserRepositoryImpl} from '@infrastructure/repositories/user.repository.impl';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {bookshelfPrisma, createCustomBookshelfDto, mockUserPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

jest.mock('@data/postgres', () => ({
    prisma: {
        user: {
            findFirst: jest.fn(),
        },
        bookshelf: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('bookshelf controller tests', () => {
    const userRepository = new UserRepositoryImpl(new UserDatasourceImpl());
    const bookshelfDatasource = new BookshelfDatasourceImpl();
    const bookshelfRepository = new BookshelfRepositoryImpl(bookshelfDatasource);
    const bookshelfController = new BookshelfController(
        bookshelfRepository,
        userRepository
    );

    let mockRequest: Partial<Request> = {
        body: {},
        params: {},
    };

    let mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('createCustom()', () => {
        test('should return a 201 status and bookshelf data when created successfully', async () => {
            mockRequest.body = {...createCustomBookshelfDto};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
            (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.bookshelf.create as jest.Mock).mockResolvedValue(bookshelfPrisma);

            await new Promise<void>((resolve) => {
                bookshelfController.createCustom(
                    mockRequest as Request,
                    mockResponse as Response
                );
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: expect.any(String),
                data: expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                }),
            });
        });
        test('should throw a 400 error when request body is empty', async () => {
            mockRequest.body = {};

            await bookshelfController.createCustom(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: expect.any(Object),
            });
        });
        test('should throw a 400 error status if user with provided ID does not exist', async () => {
            mockRequest.body = {...createCustomBookshelfDto};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await new Promise<void>((resolve) => {
                bookshelfController.createCustom(
                    mockRequest as Request,
                    mockResponse as Response
                );
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING},
            });
        });
        test('should throw a 400 error status if bookshelf with provided name already exists', async () => {
            mockRequest.body = {...createCustomBookshelfDto};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
            (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(bookshelfPrisma);

            await new Promise<void>((resolve) => {
                bookshelfController.createCustom(
                    mockRequest as Request,
                    mockResponse as Response
                );
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ERROR_MESSAGES.BOOKSHELF.CREATE_CUSTOM.EXISTING},
            });
        });
    });
    describe('getMyBookshelves()', () => {
        test('should return a 200 status and bookshelves data', async () => {
            const {userId} = createCustomBookshelfDto;
            mockRequest.params = {userId: String(userId)};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
            (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([bookshelfPrisma]);

            await new Promise<void>((resolve) => {
                bookshelfController.getMyBookshelves(
                    mockRequest as Request,
                    mockResponse as Response
                );
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: expect.any(String),
                data: expect.any(Array),
            });
        });
        test('should throw a 400 error if params are empty', async () => {
            mockRequest.params = {};

            await bookshelfController.getMyBookshelves(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: expect.any(String)},
            });
        });
        test('should throw a 400 error when user with provided ID does not exist', async () => {
            const {userId} = createCustomBookshelfDto;
            mockRequest.params = {userId: String(userId)};

            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            await new Promise<void>((resolve) => {
                bookshelfController.getMyBookshelves(
                    mockRequest as Request,
                    mockResponse as Response
                );
                setImmediate(resolve);
            });

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING},
            });
        });
    });
});
