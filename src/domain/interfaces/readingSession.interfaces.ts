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
