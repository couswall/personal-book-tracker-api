import {BookshelfBookDatasource} from '@domain/datasources/bookshelfbook.datasource';
import {BookshelfBookEntity} from '@domain/entities';
import {
    AddToBookshelfDto,
    UpdateBookshelfDto,
    RemoveFromBookshelfDto,
    UpdateReadingProgressDto,
} from '@domain/dtos';
import {bookshelfBookEntity} from '@tests/fixtures';

describe('bookshelfbook.datasource tests', () => {
    class MockBookshelfBookDatasource implements BookshelfBookDatasource {
        async addToBookshelf(
            _addToBookshelfDto: AddToBookshelfDto
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
        async updateBookshelf(
            _updateBookshelfDto: UpdateBookshelfDto
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
        async removeFromBookshelf(
            _removeFromBookshelfDto: RemoveFromBookshelfDto
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
        async updateReadingProgress(
            _updateReadingProgressDto: UpdateReadingProgressDto
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
        async getBookshelfBookById(
            _bookshelfBookId: number
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
        async finishReadingProgress(
            _bookshelfBookId: number,
            _readBookshelfId: number
        ): Promise<BookshelfBookEntity> {
            return bookshelfBookEntity;
        }
    }

    const mockDatasource = new MockBookshelfBookDatasource();

    test('abstract class should include all its methods', async () => {
        expect(mockDatasource).toBeInstanceOf(MockBookshelfBookDatasource);
        expect(typeof mockDatasource.addToBookshelf).toBe('function');
        expect(typeof mockDatasource.updateBookshelf).toBe('function');
        expect(typeof mockDatasource.removeFromBookshelf).toBe('function');
        expect(typeof mockDatasource.updateReadingProgress).toBe('function');
        expect(typeof mockDatasource.getBookshelfBookById).toBe('function');
        expect(typeof mockDatasource.finishReadingProgress).toBe('function');
    });

    test('addToBookshelf() should return a BookshelfBookEntity', async () => {
        const dto = new AddToBookshelfDto(5, 'apiBookId123');
        const result = await mockDatasource.addToBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });

    test('updateBookshelf() should return a BookshelfBookEntity', async () => {
        const dto = new UpdateBookshelfDto(101, 50);
        const result = await mockDatasource.updateBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });

    test('removeFromBookshelf() should return a BookshelfBookEntity', async () => {
        const dto = new RemoveFromBookshelfDto(101);
        const result = await mockDatasource.removeFromBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });

    test('updateReadingProgress() should return a BookshelfBookEntity', async () => {
        const dto = new UpdateReadingProgressDto(101, 'PAGE', 150);
        const result = await mockDatasource.updateReadingProgress(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });

    test('getBookshelfBookById() should return a BookshelfBookEntity', async () => {
        const result = await mockDatasource.getBookshelfBookById(101);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });

    test('finishReadingProgress() should return a BookshelfBookEntity', async () => {
        const result = await mockDatasource.finishReadingProgress(101, 2);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
    });
});
