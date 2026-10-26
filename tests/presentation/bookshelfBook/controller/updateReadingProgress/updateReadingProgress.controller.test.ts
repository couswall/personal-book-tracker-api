import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {createBookshelfBookControllerSetup} from '@tests/presentation/bookshelfBook/controller/setup';
import {
    bookshelfBookPrisma,
    bookshelfPrisma,
    readBookshelfPrisma,
    updateReadingProgressDtoObject,
} from '@tests/fixtures';
import {readingSessionObject} from '@tests/fixtures/readingSession.fixtures';

describe('BookshelfBookController.updateReadingProgress tests', () => {
    const {controller, mockRequest, mockResponse} = createBookshelfBookControllerSetup();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 200 status when updating progress by PAGE is successful', async () => {
        mockRequest.body = {
            ...updateReadingProgressDtoObject,
            progressType: 'PAGE',
            value: 150,
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            currentPage: 150,
            readingProgress: 50,
        });

        await new Promise<void>((resolve) => {
            controller.updateReadingProgress(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Reading progress updated successfully',
            data: {bookshelfBook: expect.any(Object)},
        });
    });

    test('should return a 200 status when updating progress by PERCENTAGE is successful', async () => {
        mockRequest.body = {
            ...updateReadingProgressDtoObject,
            progressType: 'PERCENTAGE',
            value: 60,
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            currentPage: 180,
            readingProgress: 60,
        });

        await new Promise<void>((resolve) => {
            controller.updateReadingProgress(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Reading progress updated successfully',
            data: {bookshelfBook: expect.any(Object)},
        });
    });

    test('should move the book to the Read bookshelf and return 200 when isFinished is true', async () => {
        mockRequest.body = {
            ...updateReadingProgressDtoObject,
            progressType: 'PAGE',
            value: 300,
            isFinished: true,
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            bookshelfId: readBookshelfPrisma.id,
            readingProgress: 100,
            currentPage: bookshelfBookPrisma.totalPages,
        });
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValueOnce(bookshelfPrisma);
        (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(readBookshelfPrisma);
        (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.readingSession.create as jest.Mock).mockResolvedValue(
            readingSessionObject
        );

        await new Promise<void>((resolve) => {
            controller.updateReadingProgress(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Reading progress updated successfully',
            data: {bookshelfBook: expect.any(Object)},
        });
        expect(prisma.$transaction).toHaveBeenCalled();
        expect(prisma.bookshelf.findFirst).toHaveBeenCalledWith({
            where: {
                userId: bookshelfPrisma.userId,
                type: readBookshelfPrisma.type,
                deletedAt: null,
            },
        });
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            where: {id: bookshelfBookPrisma.id},
            data: {
                bookshelfId: readBookshelfPrisma.id,
                readingProgress: 100,
                currentPage: bookshelfBookPrisma.totalPages,
            },
        });
    });
});
