import {BookshelfType} from '@/generated/prisma';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {BookshelfEntity} from '@domain/entities/index';
import {
    IBookshelfCount,
    IBookshelfWithStatus,
    IShelfBook,
} from '@domain/interfaces/bookshelf.interfaces';
import {
    bookshelfCount,
    bookshelfEntity,
    bookshelfWithStatus,
    shelfBook,
} from 'tests/fixtures/index';

describe('bookshelf.repository tests', () => {
    class MockBookshelfRepository implements BookshelfRepository {
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

        async getBookshelfCounts(_userId: number): Promise<IBookshelfCount[]> {
            return [bookshelfCount];
        }

        async getShelfBooks(
            _userId: number,
            _type: BookshelfType,
            _limit: number
        ): Promise<IShelfBook[]> {
            return [shelfBook];
        }
    }

    const mockBookshelfRepository = new MockBookshelfRepository();

    test('abstract class should include all its methods', () => {
        expect(mockBookshelfRepository).toBeInstanceOf(MockBookshelfRepository);
        expect(typeof mockBookshelfRepository.getMyBookshelves).toBe('function');
        expect(typeof mockBookshelfRepository.getBookshelfByUserAndType).toBe('function');
        expect(typeof mockBookshelfRepository.getBookshelvesWithStatus).toBe('function');
    });

    test('getMyBookshelves() should return an array of Bookshelf entities', async () => {
        const result = await mockBookshelfRepository.getMyBookshelves(1);

        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toBeInstanceOf(BookshelfEntity);
    });

    test('getBookshelfById() should return a BookshelfEntity instance', async () => {
        const result = await mockBookshelfRepository.getBookshelfById(bookshelfEntity.id);

        expect(result).toBeInstanceOf(BookshelfEntity);
    });

    test('getBookshelfByUserAndType() should return a BookshelfEntity instance', async () => {
        const result = await mockBookshelfRepository.getBookshelfByUserAndType(
            1,
            BookshelfType.READ
        );

        expect(result).toBeInstanceOf(BookshelfEntity);
    });
});
