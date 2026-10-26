import {CustomError} from '@domain/errors/custom.error';
import {IFinishSessionDates} from '@domain/interfaces/readingSession.interfaces';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {ERROR_MESSAGES} from '@infrastructure/constants';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (date: Date): number =>
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

/**
 * finishedAt is a date-only value (UTC midnight) while startedAt is a full
 * timestamp, so a book started and finished on the same local day can look
 * "finished before started" by up to a day. Within that tolerance, startedAt
 * is moved back to finishedAt; anything earlier is rejected.
 */
export const resolveFinishDates = (
    startedAt: Date,
    finishedAt: Date
): IFinishSessionDates => {
    if (finishedAt >= startedAt) return {finishedAt};

    if (finishedAt.getTime() < startOfUtcDay(startedAt) - ONE_DAY_MS)
        throw CustomError.badRequest(
            ERROR_MESSAGES.READING_SESSION.FINISHED_BEFORE_STARTED
        );

    return {finishedAt, startedAt: finishedAt};
};

export const startReadingSession = async (
    repository: ReadingSessionRepository,
    userId: number,
    bookId: number
): Promise<void> => {
    const openSession = await repository.findOpenSession(userId, bookId);
    if (openSession) return;

    await repository.createSession({
        userId,
        bookId,
        startedAt: new Date(),
        finishedAt: null,
    });
};

/**
 * finishedAt: undefined → finished now, Date → finished on that date,
 * null → date unknown (any open session is discarded and nothing is counted).
 */
export const finishReadingSession = async (
    repository: ReadingSessionRepository,
    userId: number,
    bookId: number,
    finishedAt?: Date | null
): Promise<void> => {
    const openSession = await repository.findOpenSession(userId, bookId);

    if (finishedAt === null) {
        if (openSession) await repository.discardSession(openSession.id);
        return;
    }

    const finishDate = finishedAt ?? new Date();

    if (!openSession) {
        await repository.createSession({
            userId,
            bookId,
            startedAt: finishDate,
            finishedAt: finishDate,
        });
        return;
    }

    await repository.finishSession(
        openSession.id,
        resolveFinishDates(openSession.startedAt, finishDate)
    );
};

/** Drops the in-progress record of a book the user stopped reading without finishing. */
export const discardOpenSession = async (
    repository: ReadingSessionRepository,
    userId: number,
    bookId: number
): Promise<void> => {
    const openSession = await repository.findOpenSession(userId, bookId);
    if (openSession) await repository.discardSession(openSession.id);
};
