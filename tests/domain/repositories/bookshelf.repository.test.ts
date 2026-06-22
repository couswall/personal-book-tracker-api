import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {CreateCustomBookShelfDto} from '@domain/dtos';
import {BookshelfEntity} from '@domain/entities/index';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';
import {
    bookshelfEntity,
    bookshelfWithStatus,
    createCustomBookshelfDto,
} from 'tests/fixtures/index';

describe('bookshelf.repository tests', () => {
    class MockBookshelfRepository implements BookshelfRepository {
        async createCustom(
            _createBookShelfDto: CreateCustomBookShelfDto
        ): Promise<BookshelfEntity> {
            return bookshelfEntity;
        }

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
        expect(typeof mockBookshelfRepository.createCustom).toBe('function');
        expect(typeof mockBookshelfRepository.getMyBookshelves).toBe('function');
        expect(typeof mockBookshelfRepository.getBookshelvesWithStatus).toBe('function');
    });

    test('createCustom() should return a BookshelfEntity instance', async () => {
        const [, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

        const result = await mockBookshelfRepository.createCustom(
            dto as CreateCustomBookShelfDto
        );

        expect(result).toBeInstanceOf(BookshelfEntity);
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
