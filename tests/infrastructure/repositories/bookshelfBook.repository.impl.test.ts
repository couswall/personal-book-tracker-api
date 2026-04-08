import {BookshelfBookDatasource} from '@domain/datasources/bookshelfbook.datasource';
import {
    AddToBookshelfDto,
    UpdateBookshelfDto,
    RemoveFromBookshelfDto,
} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {BookshelfBookRepositoryImpl} from '@infrastructure/repositories/bookshelfBook.repository.impl';
import {bookshelfBookEntity, removeFromBookshelfDtoObject} from '@tests/fixtures';

describe('bookshelfBook.repository.impl tests', () => {
    const mockDatasource: jest.Mocked<BookshelfBookDatasource> = {
        addToBookshelf: jest.fn(),
        updateBookshelf: jest.fn(),
        removeFromBookshelf: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const repository = new BookshelfBookRepositoryImpl(mockDatasource);

    test('addToBookshelf() should return a BookshelfBookEntity and call datasource.addToBookshelf()', async () => {
        const dto = new AddToBookshelfDto(1, 'apiBook123');
        mockDatasource.addToBookshelf.mockResolvedValue(bookshelfBookEntity);
        const result = await repository.addToBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockDatasource.addToBookshelf).toHaveBeenCalledWith({
            bookshelfId: 1,
            apiBookId: 'apiBook123',
        });
    });

    test('updateBookshelf() should return a BookshelfBookEntity and call datasource.updateBookshelf()', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        mockDatasource.updateBookshelf.mockResolvedValue(bookshelfBookEntity);
        const result = await repository.updateBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockDatasource.updateBookshelf).toHaveBeenCalledWith({
            bookshelfBookId: 1,
            bookshelfId: 1,
        });
    });

    test('removeFromBookshelf() should return a BookshelfBookEntity and call datasource.removeFromBookshelf()', async () => {
        const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);
        mockDatasource.removeFromBookshelf.mockResolvedValue(bookshelfBookEntity);
        if (!dto) throw new Error();
        const result = await repository.removeFromBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockDatasource.removeFromBookshelf).toHaveBeenCalledWith(dto);
    });
});
