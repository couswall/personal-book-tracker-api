import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { prisma } from "@tests/setup/prisma.mock";
import { createBookDatasource } from "@tests/infrastructure/datasources/book.datasource.impl/setup";
import { GetBookByIdDto } from "@domain/dtos";
import {mockBookPrisma,searchAPIResponseObj} from "@tests/fixtures";
import { BookEntity } from "@domain/entities/book.entity";
import { CustomError } from "@domain/errors/custom.error";
import { ERROR_MESSAGES } from "@infrastructure/constants";

describe("BookDatasourceImpl.getBookById", () => {
    const { bookDatasourceImpl, mockHttpAdapter } = createBookDatasource();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return existing book from database when found by numeric ID", async () => {
        const bookId = "123";
        const dto = new GetBookByIdDto(bookId);

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);

        const result = await bookDatasourceImpl.getBookById(dto);

        expect(result).toBeInstanceOf(BookEntity);
        expect(prisma.book.findFirst).toHaveBeenCalledWith({
        where: { id: Number(bookId), deletedAt: null },
        });
    });
    test("should return existing book from database when found by API book ID", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);

        const result = await bookDatasourceImpl.getBookById(dto);

        expect(result).toBeInstanceOf(BookEntity);
        expect(prisma.book.findFirst).toHaveBeenCalledWith({
        where: { apiBookId: bookId, deletedAt: null },
        });
    });
    test("should fetch book from API when not found in database", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[0];

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockResolvedValue(apiBook);

        const result = await bookDatasourceImpl.getBookById(dto);

        expect(result).toBeInstanceOf(BookEntity);
        expect(mockHttpAdapter.get).toHaveBeenCalledWith(
            expect.stringContaining(`/volumes/${bookId}`)
        );
        expect(result.id).toBe(0);
    });
    test("should throw CustomError when API returns 503 (book not found)", async () => {
        const bookId = "invalid-id";
        const dto = new GetBookByIdDto(bookId);

        const axiosError = new AxiosError("Service unavailable", "503", {} as InternalAxiosRequestConfig, null, {
            data: { error: { code: 503 } },
            status: 503,
            statusText: "Service Unavailable",
            headers: {},
            config: {} as InternalAxiosRequestConfig,
        });

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockRejectedValue(axiosError);

        await expect(bookDatasourceImpl.getBookById(dto)).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOK.GET_BOOK_BY_ID.NOT_FOUND)
        );
    });

    test('should throw internal server error for other API errors', async () => {
        const bookId = 'abc123';
        const dto = new GetBookByIdDto(bookId);
        const axiosError = new AxiosError("Service unavailable", "500", {} as InternalAxiosRequestConfig, null, {
            data: { error: { code: 500 } },
            status: 500,
            statusText: "Service Unavailable",
            headers: {},
            config: {} as InternalAxiosRequestConfig,
        });

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockRejectedValue(axiosError);

        await expect(bookDatasourceImpl.getBookById(dto)).rejects.toThrow(
            CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL)
        );
    });

    test('should throw internal server error for non-Axios errors', async () => {
        const bookId = 'abc123';
        const dto = new GetBookByIdDto(bookId);

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockRejectedValue(new Error('Network error'));

        await expect(bookDatasourceImpl.getBookById(dto)).rejects.toThrow(
            CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL)
        );
    });
});
