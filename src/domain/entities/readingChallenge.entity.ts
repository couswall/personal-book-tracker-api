import {IReadingChallengeFromObject} from '@domain/interfaces/readingChallenge.interfaces';

export class ReadingChallengeEntity {
    constructor(
        public id: number,
        public userId: number,
        public year: number,
        public goal: number,
        public createdAt: Date,
        public updatedAt: Date | null
    ) {}

    static fromObject(object: IReadingChallengeFromObject): ReadingChallengeEntity {
        return new ReadingChallengeEntity(
            object.id,
            object.userId,
            object.year,
            object.goal,
            object.createdAt,
            object.updatedAt
        );
    }
}
