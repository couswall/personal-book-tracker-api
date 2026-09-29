import {UpdateReadingProgressDto} from '@domain/dtos';
import {ReadingSessionEntity} from '@domain/entities';
import {UpdateReadingProgress} from '@domain/use-cases/bookshelfBook/updateReadingProgress-bookshelfBook';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {
    bookshelfBookEntity,
    bookshelfEntity,
    readBookshelfEntity,
    readingSessionEntity,
    readingSessionObject,
} from '@tests/fixtures';

describe('updateReadingProgress-bookshelfBook use case reading sessions', () => {
    const {
        mockBookRepository,
        mockBookshelfBookRepository,
        mockBookshelfRepository,
        mockReadingSessionRepository: sessions,
    } = getMockRepositories();
    const {userId} = bookshelfEntity;
    const {bookId} = bookshelfBookEntity;

    const finish = (finishedAt?: Date | null) =>
        new UpdateReadingProgress(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            sessions
        ).execute(new UpdateReadingProgressDto(1, 'PAGE', 150, true, finishedAt), userId);

    beforeEach(() => {
        jest.clearAllMocks();
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
        sessions.findOpenSession.mockResolvedValue(null);
    });

    test('should finish the open session now when no date is given', async () => {
        sessions.findOpenSession.mockResolvedValue(readingSessionEntity);

        await finish();

        expect(sessions.findOpenSession).toHaveBeenCalledWith(userId, bookId);
        expect(sessions.finishSession).toHaveBeenCalledWith(readingSessionEntity.id, {
            finishedAt: expect.any(Date),
        });
        expect(sessions.createSession).not.toHaveBeenCalled();
    });

    test('should finish the open session on the given date', async () => {
        const finishedAt = new Date('2026-03-15T00:00:00Z');
        const openSession = ReadingSessionEntity.fromObject({
            ...readingSessionObject,
            startedAt: new Date('2026-03-01T10:00:00Z'),
            finishedAt: null,
        });
        sessions.findOpenSession.mockResolvedValue(openSession);

        await finish(finishedAt);

        expect(sessions.finishSession).toHaveBeenCalledWith(openSession.id, {
            finishedAt,
        });
    });

    test('should create an already-finished session when no session is open', async () => {
        await finish();

        const [{startedAt, finishedAt}] = sessions.createSession.mock.calls[0];
        expect(finishedAt).toEqual(expect.any(Date));
        expect(startedAt).toBe(finishedAt);
        expect(sessions.finishSession).not.toHaveBeenCalled();
    });

    test('should discard the open session when the finish date is unknown', async () => {
        sessions.findOpenSession.mockResolvedValue(readingSessionEntity);

        await finish(null);

        expect(sessions.discardSession).toHaveBeenCalledWith(readingSessionEntity.id);
        expect(sessions.finishSession).not.toHaveBeenCalled();
        expect(sessions.createSession).not.toHaveBeenCalled();
    });

    test('should not count the book twice when it is already on the READ shelf', async () => {
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(readBookshelfEntity);

        await finish();

        expect(mockBookshelfBookRepository.finishReadingProgress).toHaveBeenCalled();
        expect(sessions.findOpenSession).not.toHaveBeenCalled();
        expect(sessions.createSession).not.toHaveBeenCalled();
    });

    test('should not touch reading sessions when isFinished is false', async () => {
        mockBookshelfBookRepository.updateReadingProgress.mockResolvedValue(
            bookshelfBookEntity
        );

        await new UpdateReadingProgress(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            sessions
        ).execute(new UpdateReadingProgressDto(1, 'PAGE', 150, false), userId);

        expect(sessions.findOpenSession).not.toHaveBeenCalled();
    });
});
