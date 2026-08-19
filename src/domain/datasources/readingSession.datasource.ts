import {ReadingSessionEntity} from '@domain/entities';
import {ICreateReadingSession} from '@domain/interfaces/readingSession.interfaces';

export abstract class ReadingSessionDatasource {
    abstract findOpenSession(
        userId: number,
        bookId: number
    ): Promise<ReadingSessionEntity | null>;
    abstract createSession(data: ICreateReadingSession): Promise<ReadingSessionEntity>;
    abstract finishSession(sessionId: number): Promise<ReadingSessionEntity>;
}
