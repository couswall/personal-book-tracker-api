import {Request, Response} from 'express';
import {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {prisma} from '@tests/setup';
import {createBookshelfBookControllerSetup} from '@tests/presentation/bookshelfBook/controller/setup';
import {
    addToBookshelfDtoObject,
    bookshelfBookPrisma,
    bookshelfObj,
    mockBookPrisma,
    searchAPIResponseObj,
} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookController.addToBookshelf tests', () => {
    const {controller, mockRequest, mockResponse, mockHttpAdapter} =
        createBookshelfBookControllerSetup();

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test('should return a 200 status and book data when adding is successful with string ID', async () => {
        mockRequest.body = {...addToBookshelfDtoObject};

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfObj);
        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await new Promise<void>((resolve) => {
            controller.addToBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Bookshelf Book added to bookshelf',
            data: expect.any(Object),
        });
        expect(prisma.book.findFirst).toHaveBeenCalledWith({
            where: {apiBookId: addToBookshelfDtoObject.apiBookId, deletedAt: null},
        });
    });

    test('should return a 200 status and book data when adding is successful with numeric ID', async () => {
        const bodyRequest = {apiBookId: '12', bookshelfId: 1};
        mockRequest.body = bodyRequest;

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfObj);
        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await new Promise<void>((resolve) => {
            controller.addToBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Bookshelf Book added to bookshelf',
            data: expect.any(Object),
        });
        expect(prisma.book.findFirst).toHaveBeenCalledWith({
            where: {id: Number(bodyRequest.apiBookId), deletedAt: null},
        });
    });

    test('should fetch book in external API if it does not exist in database', async () => {
        mockRequest.body = {...addToBookshelfDtoObject};
        const apiBook = searchAPIResponseObj.items[0];

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockResolvedValue(apiBook);
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.book.create as jest.Mock).mockResolvedValue(mockBookPrisma);
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfObj);
        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await new Promise<void>((resolve) => {
            controller.addToBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Bookshelf Book added to bookshelf',
            data: expect.any(Object),
        });
        expect(mockHttpAdapter.get).toHaveBeenCalled();
    });

    test('should throw an error when request body is empty', async () => {
        mockRequest.body = {};

        await controller.addToBookshelf(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: expect.any(String)},
        });
    });

    test('should throw an error when bookshelf with provided ID does not exist in database', async () => {
        mockRequest.body = {...addToBookshelfDtoObject};

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(null);

        await new Promise<void>((resolve) => {
            controller.addToBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND},
        });
    });

    test('should throw a 400 status when external API returns 503 (book not found)', async () => {
        mockRequest.body = {...addToBookshelfDtoObject};
        const axiosError = new AxiosError(
            'Service unavailable',
            '503',
            {} as InternalAxiosRequestConfig,
            null,
            {
                data: {error: {code: 503}},
                status: 503,
                statusText: 'Service Unavailable',
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            }
        );

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockRejectedValue(axiosError);

        await new Promise<void>((resolve) => {
            controller.addToBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.BOOK.GET_BOOK_BY_ID.NOT_FOUND},
        });
        expect(prisma.bookshelfBook.create).not.toHaveBeenCalled();
    });
    test('should throw a 500 status when external API returns 500', async () => {
        mockRequest.body = {...addToBookshelfDtoObject};
        const axiosError = new AxiosError(
            'Service unavailable',
            '500',
            {} as InternalAxiosRequestConfig,
            null,
            {
                data: {error: {code: 500}},
                status: 500,
                statusText: 'Service Unavailable',
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            }
        );

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockRejectedValue(axiosError);

        await new Promise<void>((resolve) => {
            controller.addToBookshelf(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL},
        });
        expect(prisma.bookshelfBook.create).not.toHaveBeenCalled();
    });
});
