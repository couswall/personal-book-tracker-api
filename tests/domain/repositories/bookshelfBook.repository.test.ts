import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {AddToBookshelfDto, UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {bookshelfBookEntity} from '@tests/fixtures';

describe('bookshelfBook.repository tests', () => {
    class MockBookshelfBookRepository implements BookshelfBookRepository {
        async addToBookshelf(
            addToBookshelfDto: AddToBookshelfDto
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
        async updateBookshelf(
            updateBookshelfDto: UpdateBookshelfDto
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
    }

    const mockRepository = new MockBookshelfBookRepository();

    test('abstract class should include all its methods', async () => {
        expect(mockRepository).toBeInstanceOf(MockBookshelfBookRepository);
        expect(typeof mockRepository.addToBookshelf).toBe('function');
        expect(typeof mockRepository.updateBookshelf).toBe('function');
    });

    test('addToBookshelf() should return a BookshelfBookEntity', async () => {
        const dto = new AddToBookshelfDto(5, 'apiBookId123');
        const result = await mockRepository.addToBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });

    test('updateBookshelf() should return a BookshelfBookEntity', async () => {
        const dto = new UpdateBookshelfDto(101, 50);
        const result = await mockRepository.updateBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });
});
