import {BookshelfType} from '@/generated/prisma';
import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {BookshelfEntity} from '@domain/entities';
import {
    bookshelfEntity,
    bookshelfObj,
    bookshelfWithStatus,
    readBookshelfEntity,
} from '@tests/fixtures';

describe('bookshelf.repository.impl tests', () => {
    const mockDatasource: jest.Mocked<BookshelfDatasource> = {
        getMyBookshelves: jest.fn(),
        getBookshelfById: jest.fn(),
        getBookshelfByUserAndType: jest.fn(),
        getBookshelvesWithStatus: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRepositoryImpl = new BookshelfRepositoryImpl(mockDatasource);

    test('getMyBookshelves() should call datasource.getMyBookshelves() and return an array of BookshelfEntity', async () => {
        mockDatasource.getMyBookshelves.mockResolvedValue([bookshelfEntity]);

        const result = await mockRepositoryImpl.getMyBookshelves(bookshelfObj.userId);

        expect(mockDatasource.getMyBookshelves).toHaveBeenCalledWith(bookshelfObj.userId);
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toBeInstanceOf(BookshelfEntity);
    });

    test('getBookshelfById() should call datasource.getBookshelfById() and return a BookshelfEntity', async () => {
        mockDatasource.getBookshelfById.mockResolvedValue(bookshelfEntity);

        const result = await mockRepositoryImpl.getBookshelfById(bookshelfObj.id);

        expect(mockDatasource.getBookshelfById).toHaveBeenCalledWith(bookshelfObj.id);
        expect(result).toBeInstanceOf(BookshelfEntity);
    });

    test('getBookshelfByUserAndType() should call datasource.getBookshelfByUserAndType() and return a BookshelfEntity', async () => {
        mockDatasource.getBookshelfByUserAndType.mockResolvedValue(readBookshelfEntity);

        const result = await mockRepositoryImpl.getBookshelfByUserAndType(
            bookshelfObj.userId,
            BookshelfType.READ
        );

        expect(mockDatasource.getBookshelfByUserAndType).toHaveBeenCalledWith(
            bookshelfObj.userId,
            BookshelfType.READ
        );
        expect(result).toBeInstanceOf(BookshelfEntity);
    });

    test('getBookshelvesWithStatus() should call datasource.getBookshelvesWithStatus() and return its result', async () => {
        const apiBookId = 'abc123';
        mockDatasource.getBookshelvesWithStatus.mockResolvedValue([bookshelfWithStatus]);

        const result = await mockRepositoryImpl.getBookshelvesWithStatus(
            bookshelfObj.userId,
            apiBookId
        );

        expect(mockDatasource.getBookshelvesWithStatus).toHaveBeenCalledWith(
            bookshelfObj.userId,
            apiBookId
        );
        expect(result).toEqual([bookshelfWithStatus]);
    });
});
