import { BookRepository } from "@domain/repositories/book.repository";
import { CreateBookDto, GetBookByIdDto, SearchBookDto } from "@domain/dtos";
import { BookEntity } from "@domain/entities/book.entity";
import { bookEntity, bookObj, createBookDtoObj, searchingResponse } from "@tests/fixtures";
import { ISearchBookResponse } from "@domain/interfaces/book.interfaces";

describe('book.repository tests', () => {
    class MockBookRepository implements BookRepository{
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
    }

    const mockBookRepository = new MockBookRepository();

    test('abstract class should include all its methods', async () => {
        expect(mockBookRepository).toBeInstanceOf(MockBookRepository);
        expect(typeof mockBookRepository.search).toBe('function');
        expect(typeof mockBookRepository.getBookById).toBe('function');
        expect(typeof mockBookRepository.fetchByIdFromAPI).toBe('function');
        expect(typeof mockBookRepository.create).toBe('function');
        expect(typeof mockBookRepository.findOrCreateByApiId).toBe('function');
    });
    test('search() should return an object', async() => {
        const dto = new SearchBookDto('deep work');
        const result = await mockBookRepository.search(dto);
        
        expect(result).toEqual(searchingResponse);
        expect(result).toHaveProperty('page');
        expect(result).toHaveProperty('maxResults');
        expect(result).toHaveProperty('books');
    });
    test('getBookById() should return a BookEntity instance', async () => {
        const dto = new GetBookByIdDto(bookObj.apiBookId);
        const result = await mockBookRepository.getBookById(dto);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('fetchByIdFromAPI() should return a BookEntity instance', async () => {
        const dto = new GetBookByIdDto(bookObj.apiBookId);
        const result = await mockBookRepository.fetchByIdFromAPI(dto);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('create() should return a BookEntity instance', async () => {
        const [, dto] = CreateBookDto.create(createBookDtoObj);
        const result = await mockBookRepository.create(dto!);
        
        expect(result).toBeInstanceOf(BookEntity);
    });
    test('findOrCreateByApiId() should return a BookEntity instance', async () => {
        const result = await mockBookRepository.findOrCreateByApiId(bookObj.apiBookId);

        expect(result).toBeInstanceOf(BookEntity);
    });
});