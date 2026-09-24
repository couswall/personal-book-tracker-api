export interface IReadingSessionFromObject {
    id: number;
    userId: number;
    bookId: number;
    startedAt: Date;
    finishedAt: Date | null;
    createdAt: Date;
    deletedAt: Date | null;
}

export interface ICreateReadingSession {
    userId: number;
    bookId: number;
    startedAt: Date;
    finishedAt: Date | null;
}

export interface IFinishSessionDates {
    finishedAt: Date;
    startedAt?: Date;
}

export interface IDateRange {
    from: Date; // inclusive
    to: Date; // exclusive
}

export interface IFinishedReading {
    sessionId: number;
    bookId: number;
    title: string;
    coverImageUrl: string | null;
    finishedAt: Date;
}
