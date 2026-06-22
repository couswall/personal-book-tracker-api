import {Request, Response} from 'express';
import {prisma} from '@data/postgres';
import {createBookshelfControllerSetup} from '@tests/presentation/bookshelf/controller/setup';
import {
    bookshelfPrisma,
    bookshelfWithStatus,
    createCustomBookshelfDto,
    mockUserPrisma,
} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

jest.mock('@data/postgres', () => ({
    prisma: {
        user: {findFirst: jest.fn()},
        book: {findUnique: jest.fn()},
        bookshelf: {findMany: jest.fn()},
    },
}));

describe('controller - getBookshelvesWithStatus()', () => {
    const {controller, mockRequest, mockResponse} = createBookshelfControllerSetup();

    const {userId} = createCustomBookshelfDto;
    const apiBookId = 'abc123';
    const bookshelfPrismaWithIncludes = {
        ...bookshelfPrisma,
        _count: {books: bookshelfWithStatus.bookCount},
        books: [{id: bookshelfWithStatus.bookshelfBookId}],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 200 status and bookshelves with status data', async () => {
        mockRequest.params = {userId: String(userId), apiBookId};

        (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
        (prisma.book.findUnique as jest.Mock).mockResolvedValue({id: 1});
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            bookshelfPrismaWithIncludes,
        ]);

        await new Promise<void>((resolve) => {
            controller.getBookshelvesWithStatus(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: expect.any(String),
            data: {bookshelves: expect.any(Array)},
        });
    });

    test('should return a 400 error when params are missing', () => {
        mockRequest.params = {};

        controller.getBookshelvesWithStatus(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: expect.any(String)},
        });
    });

    test('should return a 400 error when user does not exist', async () => {
        mockRequest.params = {userId: String(userId), apiBookId};

        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.getBookshelvesWithStatus(
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
