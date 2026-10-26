import {
    ICreateReadingSession,
    IDateRange,
    IFinishedReading,
    IFinishSessionDates,
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

export const finishSessionDates: IFinishSessionDates = {
    finishedAt: new Date(Date.UTC(2026, 2, 15)),
};

export const yearRange2026: IDateRange = {
    from: new Date(Date.UTC(2026, 0, 1)),
    to: new Date(Date.UTC(2027, 0, 1)),
};

export const finishedReadingObject: IFinishedReading = {
    sessionId: 1,
    bookId: 1,
    title: 'The Hobbit',
    coverImageUrl: 'https://example.com/hobbit.jpg',
    finishedAt: new Date(Date.UTC(2026, 2, 15)),
};
