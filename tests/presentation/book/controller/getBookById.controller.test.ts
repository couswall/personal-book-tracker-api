import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {createBookControllerSetup} from '@tests/presentation/book/controller/setup';
import {mockBookPrisma, searchAPIResponseObj} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookController.getBookById tests', () => {
    const {bookController, mockHttpAdapter, mockRequest, mockResponse} =
        createBookControllerSetup();

    test('should return a 200 status and book data', async () => {
        mockRequest.params = {bookId: 'testBookId'};

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);

        await new Promise<void>((resolve) => {
            bookController.getBookById(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: expect.any(String),
            data: expect.any(Object),
        });
    });
    test('should return a 200 status and book data when not found in database', async () => {
        mockRequest.params = {bookId: 'testBookId'};
        const apiBook = searchAPIResponseObj.items[0];

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockResolvedValue(apiBook);

        await new Promise<void>((resolve) => {
            bookController.getBookById(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: expect.any(String),
            data: expect.any(Object),
        });
    });
    test('should throw a 400 status when external API returns 503 (book not found)', async () => {
        mockRequest.params = {bookId: 'testBookId'};

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
            bookController.getBookById(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.BOOK.GET_BOOK_BY_ID.NOT_FOUND},
        });
    });
    test('should throw a 500 status when external API returns 500', async () => {
        mockRequest.params = {bookId: 'testBookId'};

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
            bookController.getBookById(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL},
        });
    });
});
