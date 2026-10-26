import {IReadingSessionFromObject} from '@domain/interfaces/readingSession.interfaces';

export class ReadingSessionEntity {
    constructor(
        public id: number,
        public userId: number,
        public bookId: number,
        public startedAt: Date,
        public finishedAt: Date | null,
        public createdAt: Date,
        public deletedAt: Date | null
    ) {}

    static fromObject(object: IReadingSessionFromObject): ReadingSessionEntity {
        return new ReadingSessionEntity(
            object.id,
            object.userId,
            object.bookId,
            object.startedAt,
            object.finishedAt,
            object.createdAt,
            object.deletedAt
        );
    }
}
