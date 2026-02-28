import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {createBookshelfBookControllerSetup} from '@tests/presentation/bookshelfBook/controller/setup';
import {
    bookshelfBookPrisma,
    bookshelfPrisma,
    updateBookshelfDtoObject,
} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';

describe('BookshelfBookController.updateBookshelf tests', () => {
    const {controller, mockRequest, mockResponse, mockHttpAdapter} =
        createBookshelfBookControllerSetup();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 200 status when updating bookshelf is successful', async () => {
        mockRequest.body = updateBookshelfDtoObject;
        const updatedBookshelfBook = {
            ...bookshelfBookPrisma,
            bookshelfId: updateBookshelfDtoObject.bookshelfId,
        };

        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(
            updatedBookshelfBook
        );

        await new Promise<void>((resolve) => {
            controller.updateBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Bookshelf book updated successfully',
            data: {bookshelfBook: expect.any(Object)},
        });
    });

    test('should not call prisma.bookshelfBook.update if the updated bookshelfId is the same as the current one', async () => {
        mockRequest.body = {
            ...updateBookshelfDtoObject,
            bookshelfId: bookshelfBookPrisma.bookshelfId,
        };

        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );

        await new Promise<void>((resolve) => {
            controller.updateBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Bookshelf book updated successfully',
            data: {bookshelfBook: expect.any(Object)},
        });
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });

    test('should throw a 400 error when body request is undefined', async () => {
        mockRequest.body = undefined;

        await controller.updateBookshelf(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: INVALID_OBJECT_ERROR},
        });
    });

    test('should throw a 400 error status when bookshelf with provided ID does not exist', async () => {
        mockRequest.body = updateBookshelfDtoObject;

        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.updateBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND},
        });
    });

    test('should throw a 400 error status when bookshelfBook with provided ID does not exist', async () => {
        mockRequest.body = updateBookshelfDtoObject;

        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.updateBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_BOOKSHELF.NOT_FOUND},
        });
    });
});
