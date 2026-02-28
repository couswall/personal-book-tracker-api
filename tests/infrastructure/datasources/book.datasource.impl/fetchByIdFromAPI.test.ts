import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { createBookDatasource } from "@tests/infrastructure/datasources/book.datasource.impl/setup";
import { GetBookByIdDto } from "@domain/dtos";
import { searchAPIResponseObj } from "@tests/fixtures";
import { BookEntity } from "@domain/entities/book.entity";
import { CustomError } from "@domain/errors/custom.error";
import { ERROR_MESSAGES } from "@infrastructure/constants";

describe("BookDatasourceImpl.fetchByIdFromAPI", () => {
    const { bookDatasourceImpl, mockHttpAdapter } = createBookDatasource();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a BookEntity when fetching is successful", async () => {
        const bookId = "123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[0];

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result).toBeInstanceOf(BookEntity);
        expect(mockHttpAdapter.get).toHaveBeenCalledWith(
            expect.stringContaining(`/volumes/${bookId}`)
        );
        expect(result.id).toBe(0);
    });
    test("should correctly map API book data to BookEntity", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[0];

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.title).toBe(apiBook.volumeInfo.title);
        expect(result.authors).toEqual(apiBook.volumeInfo.authors);
        expect(result.apiBookId).toBe(apiBook.id);
        expect(result.subtitle).toBe(apiBook.volumeInfo.subtitle ?? null);
        expect(result.description).toBe(apiBook.volumeInfo.description ?? null);
        expect(result.pageCount).toBe(apiBook.volumeInfo.pageCount ?? 0);
        expect(result.averageRating).toBe(apiBook.volumeInfo.averageRating ?? 0);
        expect(result.reviewCount).toBe(0);
        expect(result.deletedAt).toBeNull();
    });

    test("should use smallThumbnail as cover image when available", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[0];

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.coverImageUrl).toBe(
            searchAPIResponseObj.items[0].volumeInfo.imageLinks?.smallThumbnail
        );
    });

    test("should fallback to thumbnail when smallThumbnail is not available", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[2];

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.coverImageUrl).toBe(
            searchAPIResponseObj.items[2].volumeInfo.imageLinks?.thumbnail
        );
    });

    test("should set coverImageUrl to null when no image links available", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[1];

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.coverImageUrl).toBeNull();
    });

    test("should parse valid published date from API", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[0];

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.publishedDate).toEqual(
            new Date(searchAPIResponseObj.items[0].volumeInfo.publishedDate)
        );
    });

    test("should set publishedDate to null when empty string", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = searchAPIResponseObj.items[1];

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.publishedDate).toBeNull();
    });

    test("should set publishedDate to null when undefined", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = {
            ...searchAPIResponseObj.items[0],
            volumeInfo: {
                ...searchAPIResponseObj.items[0].volumeInfo,
                publishedDate: undefined,
            },
        };

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.publishedDate).toBeNull();
    });

    test("should handle books with missing optional fields", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const apiBook = {id: "abc123", volumeInfo: {title: "Minimal Book"}};

        mockHttpAdapter.get.mockResolvedValue(apiBook);
        const result = await bookDatasourceImpl.fetchByIdFromAPI(dto);

        expect(result.title).toBe("Minimal Book");
        expect(Array.isArray(result.authors)).toBeTruthy();
        expect(result.subtitle).toBeNull();
        expect(result.description).toBeNull();
        expect(result.coverImageUrl).toBeNull();
        expect(Array.isArray(result.categories)).toBeTruthy();
        expect(result.pageCount).toBe(0);
        expect(result.averageRating).toBe(0);
        expect(result.reviewCount).toBe(0);
    });

    test("should throw CustomError when API returns 503 (book not found)", async () => {
        const bookId = "invalid-id";
        const dto = new GetBookByIdDto(bookId);

        const axiosError = new AxiosError(
            "Service unavailable",
            "503",
            {} as InternalAxiosRequestConfig,
            null,
            {
                data: { error: { code: 503 } },
                status: 503,
                statusText: "Service Unavailable",
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            }
        );

        mockHttpAdapter.get.mockRejectedValue(axiosError);

        await expect(bookDatasourceImpl.fetchByIdFromAPI(dto)).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOK.GET_BOOK_BY_ID.NOT_FOUND)
        );
    });

    test("should throw internal server error for other API errors", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);
        const axiosError = new AxiosError(
            "Service unavailable",
            "500",
            {} as InternalAxiosRequestConfig,
            null,
            {
                data: { error: { code: 500 } },
                status: 500,
                statusText: "Service Unavailable",
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            }
        );

        mockHttpAdapter.get.mockRejectedValue(axiosError);

        await expect(bookDatasourceImpl.fetchByIdFromAPI(dto)).rejects.toThrow(
            CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL)
        );
    });

    test("should throw internal server error for non-Axios errors", async () => {
        const bookId = "abc123";
        const dto = new GetBookByIdDto(bookId);

        mockHttpAdapter.get.mockRejectedValue(new Error("Network error"));

        await expect(bookDatasourceImpl.fetchByIdFromAPI(dto)).rejects.toThrow(
            CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL)
        );
    });
});
