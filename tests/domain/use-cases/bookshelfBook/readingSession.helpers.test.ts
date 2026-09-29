import {ReadingSessionEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {
    discardLatestRead,
    finishReadingSession,
    resolveFinishDates,
    startReadingSession,
} from '@domain/use-cases/bookshelfBook/readingSession.helpers';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {readingSessionEntity, readingSessionObject} from '@tests/fixtures';

describe('bookshelfBook reading session helpers', () => {
    const {mockReadingSessionRepository: repository} = getMockRepositories();
    const {userId, bookId} = readingSessionObject;
    const finishedBeforeStartedError = CustomError.badRequest(
        ERROR_MESSAGES.READING_SESSION.FINISHED_BEFORE_STARTED
    );
    const openSessionStartedAt = (startedAt: Date) =>
        ReadingSessionEntity.fromObject({
            ...readingSessionObject,
            startedAt,
            finishedAt: null,
        });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('resolveFinishDates()', () => {
        test('should keep startedAt when the book was finished after it was started', () => {
            const finishedAt = new Date('2026-09-23T00:00:00Z');

            expect(
                resolveFinishDates(new Date('2026-09-01T10:00:00Z'), finishedAt)
            ).toEqual({finishedAt});
        });

        test('should move startedAt back when started and finished on the same day', () => {
            const finishedAt = new Date('2026-09-23T00:00:00Z');

            expect(
                resolveFinishDates(new Date('2026-09-23T15:00:00Z'), finishedAt)
            ).toEqual({finishedAt, startedAt: finishedAt});
        });

        test('should tolerate a finish date one UTC day before startedAt (time zones behind UTC)', () => {
            const finishedAt = new Date('2026-09-23T00:00:00Z');

            expect(
                resolveFinishDates(new Date('2026-09-24T02:00:00Z'), finishedAt)
            ).toEqual({finishedAt, startedAt: finishedAt});
        });

        test('should throw when the book was finished more than a day before it was started', () => {
            expect(() =>
                resolveFinishDates(
                    new Date('2026-09-24T02:00:00Z'),
                    new Date('2026-09-22T00:00:00Z')
                )
            ).toThrow(finishedBeforeStartedError);
        });
    });

    describe('startReadingSession()', () => {
        test('should create an open session when none exists', async () => {
            repository.findOpenSession.mockResolvedValue(null);

            await startReadingSession(repository, userId, bookId);

            expect(repository.createSession).toHaveBeenCalledWith({
                userId,
                bookId,
                startedAt: expect.any(Date),
                finishedAt: null,
            });
        });

        test('should not create a session when one is already open', async () => {
            repository.findOpenSession.mockResolvedValue(readingSessionEntity);

            await startReadingSession(repository, userId, bookId);

            expect(repository.createSession).not.toHaveBeenCalled();
        });
    });

    describe('finishReadingSession()', () => {
        const finishedAt = new Date('2026-03-15T00:00:00Z');

        test('should create a finished session on the given date when none is open', async () => {
            repository.findOpenSession.mockResolvedValue(null);

            await finishReadingSession(repository, userId, bookId, finishedAt);

            expect(repository.createSession).toHaveBeenCalledWith({
                userId,
                bookId,
                startedAt: finishedAt,
                finishedAt,
            });
            expect(repository.finishSession).not.toHaveBeenCalled();
        });

        test('should create a session finished now when no date is given and none is open', async () => {
            repository.findOpenSession.mockResolvedValue(null);

            await finishReadingSession(repository, userId, bookId);

            const [{startedAt, finishedAt: createdFinishedAt}] =
                repository.createSession.mock.calls[0];
            expect(createdFinishedAt).toEqual(expect.any(Date));
            expect(startedAt).toBe(createdFinishedAt);
        });

        test('should finish the open session on the given date', async () => {
            const openSession = openSessionStartedAt(new Date('2026-03-01T10:00:00Z'));
            repository.findOpenSession.mockResolvedValue(openSession);

            await finishReadingSession(repository, userId, bookId, finishedAt);

            expect(repository.finishSession).toHaveBeenCalledWith(openSession.id, {
                finishedAt,
            });
            expect(repository.createSession).not.toHaveBeenCalled();
        });

        test('should finish the open session now when no date is given', async () => {
            const openSession = openSessionStartedAt(new Date('2026-03-01T10:00:00Z'));
            repository.findOpenSession.mockResolvedValue(openSession);

            await finishReadingSession(repository, userId, bookId);

            expect(repository.finishSession).toHaveBeenCalledWith(openSession.id, {
                finishedAt: expect.any(Date),
            });
        });

        test('should reject a date earlier than the open session start', async () => {
            const openSession = openSessionStartedAt(new Date('2026-04-01T10:00:00Z'));
            repository.findOpenSession.mockResolvedValue(openSession);

            await expect(
                finishReadingSession(repository, userId, bookId, finishedAt)
            ).rejects.toThrow(finishedBeforeStartedError);
            expect(repository.finishSession).not.toHaveBeenCalled();
        });

        test('should discard the open session when the date is unknown (null)', async () => {
            const openSession = openSessionStartedAt(new Date('2026-03-01T10:00:00Z'));
            repository.findOpenSession.mockResolvedValue(openSession);

            await finishReadingSession(repository, userId, bookId, null);

            expect(repository.discardSession).toHaveBeenCalledWith(openSession.id);
            expect(repository.finishSession).not.toHaveBeenCalled();
            expect(repository.createSession).not.toHaveBeenCalled();
        });

        test('should do nothing when the date is unknown (null) and no session is open', async () => {
            repository.findOpenSession.mockResolvedValue(null);

            await finishReadingSession(repository, userId, bookId, null);

            expect(repository.discardSession).not.toHaveBeenCalled();
            expect(repository.createSession).not.toHaveBeenCalled();
        });
    });

    describe('discardLatestRead()', () => {
        test('should discard the latest finished session', async () => {
            repository.findLatestFinishedSession.mockResolvedValue(readingSessionEntity);

            await discardLatestRead(repository, userId, bookId);

            expect(repository.findLatestFinishedSession).toHaveBeenCalledWith(
                userId,
                bookId
            );
            expect(repository.discardSession).toHaveBeenCalledWith(
                readingSessionEntity.id
            );
        });

        test('should do nothing when the book has never been finished', async () => {
            repository.findLatestFinishedSession.mockResolvedValue(null);

            await discardLatestRead(repository, userId, bookId);

            expect(repository.discardSession).not.toHaveBeenCalled();
        });
    });
});
