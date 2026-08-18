import {
    ICreateReadingSession,
    IReadingSessionFromObject,
} from '@domain/interfaces/readingSession.interfaces';
import {ReadingSessionEntity} from '@domain/entities';

export const readingSessionObject: IReadingSessionFromObject = {
    id: 1,
    userId: 1,
    bookId: 1,
    startedAt: new Date(),
    finishedAt: new Date(),
    createdAt: new Date(),
    deletedAt: null,
};

export const readingSessionEntity = ReadingSessionEntity.fromObject(readingSessionObject);

export const createReadingSessionObject: ICreateReadingSession = {
    userId: 1,
    bookId: 1,
    startedAt: new Date(),
    finishedAt: null,
};
