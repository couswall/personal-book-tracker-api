import {Request, Response} from 'express';
import {prisma} from '@data/postgres';
import {
    createBookshelfControllerSetup,
    AUTH_USER_ID,
} from '@tests/presentation/bookshelf/controller/setup';
import {bookshelfPrisma, mockUserPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

jest.mock('@data/postgres', () => ({
    prisma: {
        user: {findFirst: jest.fn()},
        bookshelf: {findMany: jest.fn()},
    },
}));

describe('controller - getMyBookshelves()', () => {
    const {controller, mockRequest, mockResponse} = createBookshelfControllerSetup();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 200 status and bookshelves data', async () => {
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([bookshelfPrisma]);

        await new Promise<void>((resolve) => {
            controller.getMyBookshelves(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: expect.any(String),
            data: expect.any(Array),
        });
    });

    test('should ignore a userId in params and use the authenticated user', async () => {
        mockRequest.params = {userId: String(AUTH_USER_ID + 1)};
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUserPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([bookshelfPrisma]);

        await new Promise<void>((resolve) => {
            controller.getMyBookshelves(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(prisma.bookshelf.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({userId: AUTH_USER_ID}),
            })
        );
        mockRequest.params = {};
    });

    test('should return a 401 error when there is no authenticated user', () => {
        const {controller, mockRequest, mockResponse} = createBookshelfControllerSetup();
        mockResponse.locals = {};

        controller.getMyBookshelves(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(prisma.bookshelf.findMany).not.toHaveBeenCalled();
    });

    test('should throw a 400 error when user with provided ID does not exist', async () => {
        (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.getMyBookshelves(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING},
        });
    });
});
