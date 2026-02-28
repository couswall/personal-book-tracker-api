import { CreateBookDto, GetBookByIdDto, SearchBookDto } from "@domain/dtos";
import { BookEntity } from "@domain/entities/book.entity";
import { BookDatasource } from "@domain/datasources/book.datasource";
import { BookRepositoryImpl } from "@infrastructure/repositories/book.repository.impl";
import { bookEntity, bookObj, createBookDtoObj, searchingResponse } from "@tests/fixtures";

describe('book.repository.impl tests', () => {
    const mockBookDatasource: jest.Mocked<BookDatasource> = {
        search: jest.fn(),
        getBookById: jest.fn(),
        create: jest.fn(),
        fetchByIdFromAPI: jest.fn(),
        findOrCreateByApiId: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookRepositoryImpl = new BookRepositoryImpl(mockBookDatasource);

    test('search() should call datasource.search() and return an object', async() => {
        const dto = new SearchBookDto('deep work');

        mockBookDatasource.search.mockResolvedValue(searchingResponse);
        const result = await bookRepositoryImpl.search(dto);
        
        expect(result).toEqual(searchingResponse);
        expect(result).toHaveProperty('page');
        expect(result).toHaveProperty('maxResults');
        expect(result).toHaveProperty('books');
    });
    test('getBookById() should return a BookEntity instance', async () => {
        const dto = new GetBookByIdDto(bookObj.apiBookId);
        mockBookDatasource.getBookById.mockResolvedValue(bookEntity);
        const result = await bookRepositoryImpl.getBookById(dto);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('fetchByIdFromAPI() should return a BookEntity instance', async () => {
        const dto = new GetBookByIdDto(bookObj.apiBookId);
        mockBookDatasource.fetchByIdFromAPI.mockResolvedValue(bookEntity);
        const result = await bookRepositoryImpl.fetchByIdFromAPI(dto);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('create() should return a BookEntity instance', async () => {
        const [, dto] = CreateBookDto.create(createBookDtoObj);
        mockBookDatasource.create.mockResolvedValue(bookEntity);
        const result = await bookRepositoryImpl.create(dto!);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('findOrCreateByApiId() should return a BookEntity instance', async () => {
        mockBookDatasource.findOrCreateByApiId.mockResolvedValue(bookEntity);
        const result = await bookRepositoryImpl.findOrCreateByApiId(bookObj.apiBookId);

        expect(result).toBeInstanceOf(BookEntity);
    });
});