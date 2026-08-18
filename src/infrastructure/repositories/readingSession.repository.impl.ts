import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {ReadingSessionEntity} from '@domain/entities';
import {ICreateReadingSession} from '@domain/interfaces/readingSession.interfaces';

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
}
