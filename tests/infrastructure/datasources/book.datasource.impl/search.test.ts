import { SearchBookDto } from "@domain/dtos";
import { createBookDatasource } from "@tests/infrastructure/datasources/book.datasource.impl/setup";
import { searchAPIResponseObj, searchBookDtoObj } from "@tests/fixtures";
import { CustomError } from "@domain/errors/custom.error";
import { ERROR_MESSAGES } from "@infrastructure/constants";

describe("BookDatasourceImpl.search", () => {
    const { bookDatasourceImpl, mockHttpAdapter } = createBookDatasource();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return an array of books when searching successfully", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockResolvedValue(searchAPIResponseObj);

        const result = await bookDatasourceImpl.search(dto!);

        expect(mockHttpAdapter.get).toHaveBeenCalled();
        expect(result.maxResults).toBe(dto!.maxResults);
        expect(result.page).toBe(dto!.page);
    });
    test("should call http.get with the correct URL and params", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockResolvedValue(searchAPIResponseObj);

        await bookDatasourceImpl.search(dto!);

        expect(mockHttpAdapter.get).toHaveBeenCalledWith(
        expect.stringContaining("/volumes"),
        expect.objectContaining({
            params: {
            q: dto!.searchText,
            startIndex: (dto!.page - 1) * dto!.maxResults,
            printType: dto!.printType,
            maxResults: dto!.maxResults,
            },
        })
        );
    });
    test("should return an empty books array when API responds with totalItems = 0", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockResolvedValue({
        ...searchAPIResponseObj,
        totalItems: 0,
        });

        const result = await bookDatasourceImpl.search(dto!);

        expect(result).toEqual({
        page: dto!.page,
        maxResults: dto!.maxResults,
        books: [],
        });
    });
    test("should return an empty books array when API does not include items", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockResolvedValue({ totalItems: undefined });

        const result = await bookDatasourceImpl.search(dto!);

        expect(result).toEqual({
        page: dto!.page,
        maxResults: dto!.maxResults,
        books: [],
        });
    });
    test("should map API items into formatted books", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockResolvedValue(searchAPIResponseObj);

        const result = await bookDatasourceImpl.search(dto!);

        expect(result.books[0]).toHaveProperty("id");
        expect(result.books[0]).toHaveProperty("title");
        expect(result.books[0]).toHaveProperty("authors");
        expect(result.books[0]).toHaveProperty("imageCover");
    });
    test("should fallback to thumbnail if smallThumbnail is missing", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockResolvedValue(searchAPIResponseObj);

        const result = await bookDatasourceImpl.search(dto!);

        expect(result.books[2].imageCover).toBe(
        "https://images.example.com/learning-ts-thumb.jpg"
        );
    });
    test("should return undefined for imageCover if no imageLinks exist", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockResolvedValue(searchAPIResponseObj);

        const result = await bookDatasourceImpl.search(dto!);

        expect(result.books[1].imageCover).toBeUndefined();
    });
    test("should throw a CustomError when http request fails", async () => {
        const [, dto] = SearchBookDto.create(searchBookDtoObj);
        mockHttpAdapter.get.mockRejectedValue(new Error("Network error"));

        await expect(bookDatasourceImpl.search(dto!)).rejects.toThrow(
        CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL)
        );
    });
});
