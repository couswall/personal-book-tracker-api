import {BookshelfType} from '@/generated/prisma';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {UpdateReadingProgressDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {UpdateReadingProgress} from '@domain/use-cases/bookshelfBook/updateReadingProgress-bookshelfBook';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {
    bookshelfBookEntity,
    bookshelfEntity,
    readBookshelfEntity,
    readingSessionEntity,
} from '@tests/fixtures';

describe('updateReadingProgress-bookshelfBook use case tests', () => {
    const {
        mockBookRepository,
        mockBookshelfBookRepository,
        mockBookshelfRepository,
        mockReadingSessionRepository,
    } = getMockRepositories();

    const buildUseCase = () =>
        new UpdateReadingProgress(
            mockBookshelfBookRepository,
            mockBookRepository,
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

    test('execute() should return the repository result when isFinished is false', async () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, false);
        mockBookshelfBookRepository.updateReadingProgress.mockResolvedValue(
            bookshelfBookEntity
        );

        const result = await buildUseCase().execute(dto, bookshelfEntity.userId);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result).toEqual(bookshelfBookEntity);
        expect(mockBookshelfBookRepository.updateReadingProgress).toHaveBeenCalledWith(
            dto
        );
        expect(mockBookshelfBookRepository.finishReadingProgress).not.toHaveBeenCalled();
        expect(mockBookshelfRepository.getBookshelfByUserAndType).not.toHaveBeenCalled();
    });

    test.each([false, true])(
        'execute() should not touch a bookshelf book owned by another user (isFinished: %s)',
        async (isFinished) => {
            const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, isFinished);

            await expect(
                buildUseCase().execute(dto, bookshelfEntity.userId + 1)
            ).rejects.toThrow(
                CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF_BOOK.NOT_FOUND)
            );

            expect(
                mockBookshelfBookRepository.updateReadingProgress
            ).not.toHaveBeenCalled();
            expect(
                mockBookshelfBookRepository.finishReadingProgress
            ).not.toHaveBeenCalled();
            expect(mockReadingSessionRepository.createSession).not.toHaveBeenCalled();
            expect(mockReadingSessionRepository.finishSession).not.toHaveBeenCalled();
        }
    );

    test('execute() should propagate the NOT_FOUND error from repository.updateReadingProgress', async () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150);
        mockBookshelfBookRepository.updateReadingProgress.mockRejectedValue(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_READING_PROGRESS.NOT_FOUND
            )
        );

        await expect(buildUseCase().execute(dto, bookshelfEntity.userId)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_READING_PROGRESS.NOT_FOUND
            )
        );
    });

    test('execute() should not call repository.updateReadingProgress when isFinished is true', async () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, true);
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
            bookshelfBookEntity
        );
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfRepository.getBookshelfByUserAndType.mockResolvedValue(
            readBookshelfEntity
        );
        mockBookshelfBookRepository.finishReadingProgress.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(null);

        await buildUseCase().execute(dto, bookshelfEntity.userId);

        expect(mockBookshelfBookRepository.updateReadingProgress).not.toHaveBeenCalled();
    });

    test('execute() should atomically finish and move the book to the Read bookshelf when isFinished is true', async () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, true);
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
            bookshelfBookEntity
        );
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfRepository.getBookshelfByUserAndType.mockResolvedValue(
            readBookshelfEntity
        );
        mockBookshelfBookRepository.finishReadingProgress.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(null);

        const result = await buildUseCase().execute(dto, bookshelfEntity.userId);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(mockBookshelfBookRepository.getBookshelfBookById).toHaveBeenCalledWith(
            dto.bookshelfBookId
        );
        expect(mockBookshelfRepository.getBookshelfById).toHaveBeenCalledWith(
            bookshelfBookEntity.bookshelfId
        );
        expect(mockBookshelfRepository.getBookshelfByUserAndType).toHaveBeenCalledWith(
            bookshelfEntity.userId,
            BookshelfType.READ
        );
        expect(mockBookshelfBookRepository.finishReadingProgress).toHaveBeenCalledWith(
            dto.bookshelfBookId,
            readBookshelfEntity.id
        );
    });

    test('execute() should finish an existing open reading session when isFinished is true', async () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, true);
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
            bookshelfBookEntity
        );
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfRepository.getBookshelfByUserAndType.mockResolvedValue(
            readBookshelfEntity
        );
        mockBookshelfBookRepository.finishReadingProgress.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(
            readingSessionEntity
        );

        await buildUseCase().execute(dto, bookshelfEntity.userId);

        expect(mockReadingSessionRepository.finishSession).toHaveBeenCalledWith(
            readingSessionEntity.id
        );
        expect(mockReadingSessionRepository.createSession).not.toHaveBeenCalled();
    });

    test('execute() should create an already-finished reading session when no open session exists', async () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, true);
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
            bookshelfBookEntity
        );
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfRepository.getBookshelfByUserAndType.mockResolvedValue(
            readBookshelfEntity
        );
        mockBookshelfBookRepository.finishReadingProgress.mockResolvedValue(
            bookshelfBookEntity
        );
        mockReadingSessionRepository.findOpenSession.mockResolvedValue(null);

        await buildUseCase().execute(dto, bookshelfEntity.userId);

        expect(mockReadingSessionRepository.createSession).toHaveBeenCalledWith({
            userId: bookshelfEntity.userId,
            bookId: bookshelfBookEntity.bookId,
            startedAt: expect.any(Date),
            finishedAt: expect.any(Date),
        });
        expect(mockReadingSessionRepository.finishSession).not.toHaveBeenCalled();
    });

    test('execute() should propagate NOT_FOUND when the user has no Read bookshelf', async () => {
        const dto = new UpdateReadingProgressDto(1, 'PAGE', 150, true);
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
            bookshelfBookEntity
        );
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(bookshelfEntity);
        mockBookshelfRepository.getBookshelfByUserAndType.mockRejectedValue(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_USER_AND_TYPE.NOT_FOUND
            )
        );

        await expect(buildUseCase().execute(dto, bookshelfEntity.userId)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_USER_AND_TYPE.NOT_FOUND
            )
        );
        expect(mockBookshelfBookRepository.finishReadingProgress).not.toHaveBeenCalled();
    });
});
