import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {AddToBookshelf} from '@domain/use-cases';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {
    addToBookshelfDtoObject,
    bookEntity,
    bookshelfBookEntity,
    bookshelfEntity,
} from '@tests/fixtures';

describe('addToBookshelf-bookshelfBook use case', () => {
    const {mockBookRepository, mockBookshelfBookRepository, mockBookshelfRepository} =
        getMockRepositories();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return a BookshelfBookEntity instance', async () => {
        const dto = new AddToBookshelfDto(
            addToBookshelfDtoObject.bookshelfId,
            addToBookshelfDtoObject.apiBookId
        );
        mockBookRepository.findOrCreateByApiId.mockResolvedValue(bookEntity);
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfBookRepository.addToBookshelf.mockResolvedValue(bookshelfBookEntity);

        const result = await new AddToBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository
        ).execute(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockBookRepository.findOrCreateByApiId).toHaveBeenCalledWith(
            addToBookshelfDtoObject.apiBookId
        );
        expect(mockBookshelfRepository.getBookshelfById).toHaveBeenCalledWith(
            addToBookshelfDtoObject.bookshelfId
        );
    });

    test('execute() should thorw an error when bookshelf with provided ID does not exist', async () => {
        const dto = new AddToBookshelfDto(
            addToBookshelfDtoObject.bookshelfId,
            addToBookshelfDtoObject.apiBookId
        );
        mockBookRepository.findOrCreateByApiId.mockResolvedValue(bookEntity);
        mockBookshelfRepository.getBookshelfById.mockRejectedValue(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND)
        );

        await expect(
            new AddToBookshelf(
                mockBookshelfBookRepository,
                mockBookRepository,
                mockBookshelfRepository
            ).execute(dto)
        ).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND)
        );

        expect(mockBookshelfBookRepository.addToBookshelf).not.toHaveBeenCalled();
    });
});
