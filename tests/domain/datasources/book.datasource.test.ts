import { BookDatasource } from "@domain/datasources/book.datasource";
import { CreateBookDto, GetBookByIdDto, SearchBookDto } from "@domain/dtos";
import { BookEntity } from "@domain/entities/book.entity";
import { bookEntity, bookObj, createBookDtoObj, searchingResponse } from "@tests/fixtures";
import { ISearchBookResponse } from "@domain/interfaces/book.interfaces";

describe('book.datasource tests', () => {

    class MockBookDatasource implements BookDatasource{
        async search(searchBookDto: SearchBookDto): Promise<ISearchBookResponse> {
            return searchingResponse;
        }
        async getBookById(getBookByIdDto: GetBookByIdDto): Promise<BookEntity> {
            return bookEntity;
        }
        async fetchByIdFromAPI(getBookByIdDto: GetBookByIdDto): Promise<BookEntity> {
            return bookEntity;
        }
        async create(createBookDto: CreateBookDto): Promise<BookEntity> {
            return bookEntity;
        }
        async findOrCreateByApiId(apiBookId: string): Promise<BookEntity> {
            return bookEntity;
        }
    };

    const mockBookDatasource = new MockBookDatasource();

    test('abstract class should include all its methods', async () => {
        expect(mockBookDatasource).toBeInstanceOf(MockBookDatasource);
        expect(typeof mockBookDatasource.search).toBe('function');
        expect(typeof mockBookDatasource.getBookById).toBe('function');
        expect(typeof mockBookDatasource.fetchByIdFromAPI).toBe('function');
        expect(typeof mockBookDatasource.create).toBe('function');
        expect(typeof mockBookDatasource.findOrCreateByApiId).toBe('function');
    });
    test('search() should return an object', async() => {
        const dto = new SearchBookDto('deep work');
        const result = await mockBookDatasource.search(dto);
        
        expect(result).toEqual(searchingResponse);
        expect(result).toHaveProperty('page');
        expect(result).toHaveProperty('maxResults');
        expect(result).toHaveProperty('books');
    });
    test('getBookById() should return a BookEntity instance', async () => {
        const dto = new GetBookByIdDto(bookObj.apiBookId);
        const result = await mockBookDatasource.getBookById(dto);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('fetchByIdFromAPI() should return a BookEntity instance', async () => {
        const dto = new GetBookByIdDto(bookObj.apiBookId);
        const result = await mockBookDatasource.fetchByIdFromAPI(dto);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('create() should return a BookEntity instance', async () => {
        const [, dto] = CreateBookDto.create(createBookDtoObj);
        const result = await mockBookDatasource.create(dto!);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('findOrCreateByApiId() should return a BookEntity instance', async () => {
        const result = await mockBookDatasource.findOrCreateByApiId(bookObj.apiBookId);

        expect(result).toBeInstanceOf(BookEntity);
    });
});