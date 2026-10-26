import {CustomError} from '@domain/errors/custom.error';
import {
    getOwnedBookshelf,
    getOwnedBookshelfBook,
} from '@domain/use-cases/bookshelfBook/ownership.helpers';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {bookshelfBookEntity, bookshelfEntity} from '@tests/fixtures';

describe('bookshelfBook ownership helpers', () => {
    const {mockBookshelfBookRepository, mockBookshelfRepository} = getMockRepositories();
    const ownerId = bookshelfEntity.userId;
    const otherUserId = ownerId + 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getOwnedBookshelf()', () => {
        test('should return the bookshelf when it belongs to the user', async () => {
            mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);

            const result = await getOwnedBookshelf(
                mockBookshelfRepository,
                bookshelfEntity.id,
                ownerId
            );

            expect(result).toEqual(bookshelfEntity);
            expect(mockBookshelfRepository.getBookshelfById).toHaveBeenCalledWith(
                bookshelfEntity.id
            );
        });

        test('should throw the same NOT_FOUND error as a missing bookshelf when owned by another user', async () => {
            mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);

            await expect(
                getOwnedBookshelf(
                    mockBookshelfRepository,
                    bookshelfEntity.id,
                    otherUserId
                )
            ).rejects.toThrow(
                CustomError.badRequest(
                    ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND
                )
            );
        });

        test('should propagate repository errors', async () => {
            mockBookshelfRepository.getBookshelfById.mockRejectedValue(
                new Error('DB error')
            );

            await expect(
                getOwnedBookshelf(mockBookshelfRepository, bookshelfEntity.id, ownerId)
            ).rejects.toThrow('DB error');
        });
    });

    describe('getOwnedBookshelfBook()', () => {
        test('should return the bookshelf book and its bookshelf when owned by the user', async () => {
            mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
                bookshelfBookEntity
            );
            mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);

            const result = await getOwnedBookshelfBook(
                mockBookshelfBookRepository,
                mockBookshelfRepository,
                bookshelfBookEntity.id,
                ownerId
            );

            expect(result).toEqual({
                bookshelfBook: bookshelfBookEntity,
                bookshelf: bookshelfEntity,
            });
            expect(mockBookshelfBookRepository.getBookshelfBookById).toHaveBeenCalledWith(
                bookshelfBookEntity.id
            );
            expect(mockBookshelfRepository.getBookshelfById).toHaveBeenCalledWith(
                bookshelfBookEntity.bookshelfId
            );
        });

        test('should throw the same NOT_FOUND error as a missing bookshelf book when owned by another user', async () => {
            mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
                bookshelfBookEntity
            );
            mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);

            await expect(
                getOwnedBookshelfBook(
                    mockBookshelfBookRepository,
                    mockBookshelfRepository,
                    bookshelfBookEntity.id,
                    otherUserId
                )
            ).rejects.toThrow(
                CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF_BOOK.NOT_FOUND)
            );
        });

        test('should propagate NOT_FOUND when the bookshelf book does not exist', async () => {
            mockBookshelfBookRepository.getBookshelfBookById.mockRejectedValue(
                CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF_BOOK.NOT_FOUND)
            );

            await expect(
                getOwnedBookshelfBook(
                    mockBookshelfBookRepository,
                    mockBookshelfRepository,
                    bookshelfBookEntity.id,
                    ownerId
                )
            ).rejects.toThrow(
                CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF_BOOK.NOT_FOUND)
            );
            expect(mockBookshelfRepository.getBookshelfById).not.toHaveBeenCalled();
        });
    });
});
