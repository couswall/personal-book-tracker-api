import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {BookshelfEntity} from '@domain/entities/index';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';
import {bookshelfEntity, bookshelfWithStatus} from 'tests/fixtures/index';

describe('bookshelf.repository tests', () => {
    class MockBookshelfRepository implements BookshelfRepository {
        async getMyBookshelves(_userId: number): Promise<BookshelfEntity[]> {
            return [bookshelfEntity];
        }

        async getBookshelfById(_bookshelfId: number): Promise<BookshelfEntity> {
            return bookshelfEntity;
        }

        async getBookshelvesWithStatus(
            _userId: number,
            _apiBookId: string
        ): Promise<IBookshelfWithStatus[]> {
            return [bookshelfWithStatus];
        }
    }

    const mockBookshelfRepository = new MockBookshelfRepository();

    test('abstract class should include all its methods', () => {
        expect(mockBookshelfRepository).toBeInstanceOf(MockBookshelfRepository);
        expect(typeof mockBookshelfRepository.getMyBookshelves).toBe('function');
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
});
