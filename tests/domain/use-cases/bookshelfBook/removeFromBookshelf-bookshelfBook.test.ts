import {RemoveFromBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {RemoveFromBookshelf} from '@domain/use-cases';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {
    bookshelfBookEntity,
    bookshelfEntity,
    readBookshelfEntity,
    readingSessionEntity,
    removeFromBookshelfDtoObject,
} from '@tests/fixtures';

describe('removeFromBookshelf-bookshelfBook use case', () => {
    const {
        mockBookshelfBookRepository,
        mockBookshelfRepository,
        mockReadingSessionRepository,
    } = getMockRepositories();
    const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);
    const ownerId = bookshelfEntity.userId;

    const buildUseCase = () =>
        new RemoveFromBookshelf(
            mockBookshelfBookRepository,
            mockBookshelfRepository,
            mockReadingSessionRepository
        );

    beforeEach(() => {
        jest.clearAllMocks();
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
            bookshelfBookEntity
        );
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
    });

    test('execute() should return a BookshelfBookEntity instance', async () => {
        mockBookshelfBookRepository.removeFromBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );

        const result = await buildUseCase().execute(
            dto as RemoveFromBookshelfDto,
            ownerId
        );

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockBookshelfBookRepository.removeFromBookshelf).toHaveBeenCalledWith(dto);
    });

    test('execute() should not remove a book from a bookshelf owned by another user', async () => {
        await expect(
            buildUseCase().execute(dto as RemoveFromBookshelfDto, ownerId + 1)
        ).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF_BOOK.NOT_FOUND)
        );

        expect(mockBookshelfBookRepository.removeFromBookshelf).not.toHaveBeenCalled();
    });

    test('execute() should propagate errors from the repository', async () => {
        mockBookshelfBookRepository.removeFromBookshelf.mockRejectedValue(
            new Error('DB error')
        );

        await expect(
            buildUseCase().execute(dto as RemoveFromBookshelfDto, ownerId)
        ).rejects.toThrow('DB error');
        expect(mockReadingSessionRepository.discardSession).not.toHaveBeenCalled();
    });

    test('execute() should discard the latest read when removing a book from the READ shelf', async () => {
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(readBookshelfEntity);
        mockBookshelfBookRepository.removeFromBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findLatestFinishedSession.mockResolvedValue(
            readingSessionEntity
        );

        await buildUseCase().execute(dto as RemoveFromBookshelfDto, ownerId);

        expect(
            mockReadingSessionRepository.findLatestFinishedSession
        ).toHaveBeenCalledWith(ownerId, bookshelfBookEntity.bookId);
        expect(mockReadingSessionRepository.discardSession).toHaveBeenCalledWith(
            readingSessionEntity.id
        );
    });

    test('execute() should not touch reading sessions when removing from a non-READ shelf', async () => {
        mockBookshelfBookRepository.removeFromBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );

        await buildUseCase().execute(dto as RemoveFromBookshelfDto, ownerId);

        expect(
            mockReadingSessionRepository.findLatestFinishedSession
        ).not.toHaveBeenCalled();
        expect(mockReadingSessionRepository.discardSession).not.toHaveBeenCalled();
    });
});
