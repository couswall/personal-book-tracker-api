import {BookshelfType} from '@/generated/prisma';
import {BookshelfEntity} from '@domain/entities/index';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';
import {bookshelfEntity, bookshelfWithStatus} from 'tests/fixtures/index';

describe('bookshelf datasource tests', () => {
    class MockBookshelfDatasource implements BookshelfDatasource {
        async getMyBookshelves(_userId: number): Promise<BookshelfEntity[]> {
            return [bookshelfEntity];
        }

        async getBookshelfById(_bookshelfId: number): Promise<BookshelfEntity> {
            return bookshelfEntity;
        }

        async getBookshelfByUserAndType(
            _userId: number,
            _type: BookshelfType
        ): Promise<BookshelfEntity> {
            return bookshelfEntity;
        }

        async getBookshelvesWithStatus(
            _userId: number,
            _apiBookId: string
        ): Promise<IBookshelfWithStatus[]> {
            return [bookshelfWithStatus];
        }
    }

    const mockBookshelfDatasource = new MockBookshelfDatasource();

    test('abstract class should include all its methods', () => {
        expect(mockBookshelfDatasource).toBeInstanceOf(MockBookshelfDatasource);
        expect(typeof mockBookshelfDatasource.getMyBookshelves).toBe('function');
        expect(typeof mockBookshelfDatasource.getBookshelfByUserAndType).toBe('function');
        expect(typeof mockBookshelfDatasource.getBookshelvesWithStatus).toBe('function');
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

    test('getBookshelfByUserAndType() should return a BookshelfEntity instance', async () => {
        const result = await mockBookshelfDatasource.getBookshelfByUserAndType(
            1,
            BookshelfType.READ
        );

        expect(result).toBeInstanceOf(BookshelfEntity);
    });
});
