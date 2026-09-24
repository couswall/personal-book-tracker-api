import {ReadingSessionEntity} from '@domain/entities';
import {
    ICreateReadingSession,
    IDateRange,
    IFinishedReading,
    IFinishSessionDates,
} from '@domain/interfaces/readingSession.interfaces';

export abstract class ReadingSessionRepository {
    abstract findOpenSession(
        userId: number,
        bookId: number
    ): Promise<ReadingSessionEntity | null>;
    abstract createSession(data: ICreateReadingSession): Promise<ReadingSessionEntity>;
    abstract finishSession(
        sessionId: number,
        dates: IFinishSessionDates
    ): Promise<ReadingSessionEntity>;
    abstract findLatestFinishedSession(
        userId: number,
        bookId: number
    ): Promise<ReadingSessionEntity | null>;
    abstract discardSession(sessionId: number): Promise<ReadingSessionEntity>;
    abstract getFinishedInRange(
        userId: number,
        range: IDateRange
    ): Promise<IFinishedReading[]>;
    abstract countFinishedInRange(userId: number, range: IDateRange): Promise<number>;
}
