import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {CreateCustomBookShelfDto} from '@domain/dtos';
import {BookshelfEntity} from '@domain/entities';
import {bookshelfEntity, bookshelfObj, createCustomBookshelfDto} from '@tests/fixtures';

describe('bookshelf.repository.impl tests', () => {
    const mockDatasource: jest.Mocked<BookshelfDatasource> = {
        createCustom: jest.fn(),
        getMyBookshelves: jest.fn(),
        getBookshelfById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRepositoryImpl = new BookshelfRepositoryImpl(mockDatasource);

    test('createCustom() should call datasource.createCustom() and return a BookshelfEntity', async () => {
        const [, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

        mockDatasource.createCustom.mockResolvedValue(bookshelfEntity);

        const result = await mockRepositoryImpl.createCustom(dto!);

        expect(mockDatasource.createCustom).toHaveBeenCalledWith(dto);
        expect(result).toBeInstanceOf(BookshelfEntity);
    });

    test('getMyBookshelves() should call datasource.getMyBookshelves() and return an array of BookshelfEntity', async () => {
        mockDatasource.getMyBookshelves.mockResolvedValue([bookshelfEntity]);

        const result = await mockRepositoryImpl.getMyBookshelves(
            createCustomBookshelfDto.userId
        );

        expect(mockDatasource.getMyBookshelves).toHaveBeenCalledWith(
            createCustomBookshelfDto.userId
        );
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toBeInstanceOf(BookshelfEntity);
    });

    test('getBookshelfById() should call datasource.getBookshelfById() and return a BookshelfEntity', async () => {
        mockDatasource.getBookshelfById.mockResolvedValue(bookshelfEntity);

        const result = await mockRepositoryImpl.getBookshelfById(bookshelfObj.id);

        expect(mockDatasource.getBookshelfById).toHaveBeenCalledWith(bookshelfObj.id);
        expect(result).toBeInstanceOf(BookshelfEntity);
    });
});
