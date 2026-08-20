import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {createBookshelfBookControllerSetup} from '@tests/presentation/bookshelfBook/controller/setup';
import {
    bookshelfBookPrisma,
    bookshelfPrisma,
    updateReadingProgressDtoObject,
} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';

describe('BookshelfBookController.updateReadingProgress error handling tests', () => {
    const {controller, mockRequest, mockResponse} = createBookshelfBookControllerSetup();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should throw a 400 error when body request is undefined', async () => {
        mockRequest.body = undefined;

        await new Promise<void>((resolve) => {
            controller.updateReadingProgress(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: INVALID_OBJECT_ERROR},
        });
    });

    test('should throw a 400 error when progressType is invalid', async () => {
        mockRequest.body = {...updateReadingProgressDtoObject, progressType: 'CHAPTER'};

        await new Promise<void>((resolve) => {
            controller.updateReadingProgress(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: 'progressType must be either PAGE or PERCENTAGE'},
        });
    });

    test('should throw a 400 error status when bookshelfBook with provided ID does not exist', async () => {
        mockRequest.body = updateReadingProgressDtoObject;

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await new Promise<void>((resolve) => {
            controller.updateReadingProgress(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_READING_PROGRESS.NOT_FOUND,
            },
        });
    });

    test('should throw a 400 error when isFinished is true and the user has no Read bookshelf', async () => {
        mockRequest.body = {...updateReadingProgressDtoObject, isFinished: true};

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValueOnce(bookshelfPrisma);
        (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.updateReadingProgress(
                mockRequest as Request,
                mockResponse as Response
            );
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message:
                    ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_USER_AND_TYPE.NOT_FOUND,
            },
        });
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });
});
