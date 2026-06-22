import {Request, Response} from 'express';
import {prisma} from '@data/postgres';
import {createBookshelfControllerSetup} from '@tests/presentation/bookshelf/controller/setup';
import {bookshelfPrisma, createCustomBookshelfDto, mockUserPrisma} from '@tests/fixtures';
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
        const {userId} = createCustomBookshelfDto;
        mockRequest.params = {userId: String(userId)};

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

    test('should throw a 400 error if params are empty', () => {
        mockRequest.params = {};

        controller.getMyBookshelves(mockRequest as Request, mockResponse as Response);

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
