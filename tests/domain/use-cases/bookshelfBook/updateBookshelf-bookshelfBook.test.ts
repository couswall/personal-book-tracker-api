import {ERROR_MESSAGES} from '@infrastructure/constants';
import {UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {UpdateBookshelf} from '@domain/use-cases/bookshelfBook/updateBookshelf-bookshelfBook';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {bookshelfBookEntity, bookshelfEntity} from '@tests/fixtures';

describe('updateBookshelf-bookshelfBook use case tests', () => {
    const {mockBookRepository, mockBookshelfBookRepository, mockBookshelfRepository} =
        getMockRepositories();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return a BookshelfBookEntity instance', async () => {
        const dto = new UpdateBookshelfDto(1, 1);
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );

        const result = await new UpdateBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository
        ).execute(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockBookshelfRepository.getBookshelfById).toHaveBeenCalledWith(1);
        expect(dto.bookshelfType).toBe(bookshelfEntity.type);
    });

    test('execute() should thorw an error when bookshelf with provided ID does not exist', async () => {
        const dto = new UpdateBookshelfDto(1, 1);

        mockBookshelfRepository.getBookshelfById.mockRejectedValue(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND)
        );

        await expect(
            new UpdateBookshelf(
                mockBookshelfBookRepository,
                mockBookRepository,
                mockBookshelfRepository
            ).execute(dto)
        ).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND)
        );

        expect(mockBookshelfBookRepository.updateBookshelf).not.toHaveBeenCalled();
    });
});
