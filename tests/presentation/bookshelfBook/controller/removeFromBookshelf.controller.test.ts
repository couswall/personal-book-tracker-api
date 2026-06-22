import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {createBookshelfBookControllerSetup} from '@tests/presentation/bookshelfBook/controller/setup';
import {bookshelfBookPrisma, removeFromBookshelfDtoObject} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookController.removeFromBookshelf tests', () => {
    const {controller, mockRequest, mockResponse} = createBookshelfBookControllerSetup();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 200 status and success message when removal is successful', async () => {
        mockRequest.params = {
            bookshelfBookId: String(removeFromBookshelfDtoObject.bookshelfBookId),
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            deletedAt: new Date(),
        });

        await new Promise<void>((resolve) => {
            controller.removeFromBookshelf(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Book removed from bookshelf successfully',
        });
    });

    test('should return a 400 error when bookshelfBookId param is missing', async () => {
        mockRequest.params = {};

        await new Promise<void>((resolve) => {
            controller.removeFromBookshelf(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: expect.any(String)},
        });
    });

    test('should return a 400 error when bookshelfBookId is a non-numerical string', async () => {
        mockRequest.params = {bookshelfBookId: 'abc'};

        await new Promise<void>((resolve) => {
            controller.removeFromBookshelf(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: 'bookshelfBookId must be a number'},
        });
    });

    test('should return a 400 error when bookshelf book does not exist', async () => {
        mockRequest.params = {
            bookshelfBookId: String(removeFromBookshelfDtoObject.bookshelfBookId),
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.removeFromBookshelf(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: ERROR_MESSAGES.BOOKSHELF_BOOK.REMOVE_FROM_BOOKSHELF.NOT_FOUND,
            },
        });
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });
});
