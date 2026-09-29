import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {ReadingSessionEntity} from '@domain/entities';
import {
    ICreateReadingSession,
    IDateRange,
    IFinishedReading,
    IFinishSessionDates,
} from '@domain/interfaces/readingSession.interfaces';

export class ReadingSessionRepositoryImpl implements ReadingSessionRepository {
    constructor(private readonly datasource: ReadingSessionDatasource) {}

    findOpenSession(
        userId: number,
        bookId: number
    ): Promise<ReadingSessionEntity | null> {
        return this.datasource.findOpenSession(userId, bookId);
    }

    createSession(data: ICreateReadingSession): Promise<ReadingSessionEntity> {
        return this.datasource.createSession(data);
    }

    finishSession(
        sessionId: number,
        dates: IFinishSessionDates
    ): Promise<ReadingSessionEntity> {
        return this.datasource.finishSession(sessionId, dates);
    }

    findLatestFinishedSession(
        userId: number,
        bookId: number
    ): Promise<ReadingSessionEntity | null> {
        return this.datasource.findLatestFinishedSession(userId, bookId);
    }

    discardSession(sessionId: number): Promise<ReadingSessionEntity> {
        return this.datasource.discardSession(sessionId);
    }

    getFinishedInRange(userId: number, range: IDateRange): Promise<IFinishedReading[]> {
        return this.datasource.getFinishedInRange(userId, range);
    }

    countFinishedInRange(userId: number, range: IDateRange): Promise<number> {
        return this.datasource.countFinishedInRange(userId, range);
    }
}
