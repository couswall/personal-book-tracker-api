import { CreateCustomBookShelfDto } from "@domain/dtos";
import { BookshelfEntity } from "@domain/entities/index";
import { BookshelfDatasource } from "@domain/datasources/bookshelf.datasource";
import { IBookshelfWithStatus } from "@domain/interfaces/bookshelf.interfaces";
import { bookshelfEntity, bookshelfWithStatus, createCustomBookshelfDto } from "tests/fixtures/index";

describe('bookshelf datasource tests', () => {

    class MockBookshelfDatasource implements BookshelfDatasource{
        async createCustom(createBookShelfDto: CreateCustomBookShelfDto): Promise<BookshelfEntity> {
            return bookshelfEntity;
        }

        async getMyBookshelves(userId: number): Promise<BookshelfEntity[]> {
            return [bookshelfEntity];
        }

        async getBookshelfById(bookshelfId: number): Promise<BookshelfEntity> {
            return bookshelfEntity;
        }

        async getBookshelvesWithStatus(userId: number, apiBookId: string): Promise<IBookshelfWithStatus[]> {
            return [bookshelfWithStatus];
        }
    };

    const mockBookshelfDatasource = new MockBookshelfDatasource();

    test('abstract class should include all its methods', () => {
        expect(mockBookshelfDatasource).toBeInstanceOf(MockBookshelfDatasource);
        expect(typeof mockBookshelfDatasource.createCustom).toBe('function');
        expect(typeof mockBookshelfDatasource.getMyBookshelves).toBe('function');
        expect(typeof mockBookshelfDatasource.getBookshelvesWithStatus).toBe('function');
    });

    test('createCustom() should return a BookshelfEntity instance', async () => {
        const [,dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

        const result = await mockBookshelfDatasource.createCustom(dto!);

        expect(result).toBeInstanceOf(BookshelfEntity);
    });

    test('getMyBookshelves() should return an array of Bookshelf entities', async () => {
        const result = await mockBookshelfDatasource.getMyBookshelves(1);

        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toBeInstanceOf(BookshelfEntity);
    });

    test('getBookshelfById() should return a BookshelfEntity instance', async () => {
        const result = await mockBookshelfDatasource.getBookshelfById(bookshelfEntity.id);

        expect(result).toBeInstanceOf(BookshelfEntity);
    });
});