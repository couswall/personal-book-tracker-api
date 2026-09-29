import {ReadingChallengeEntity} from '@domain/entities';
import {
    IReadingChallengeData,
    IReadingChallengeFromObject,
    IReadingChallengeKey,
} from '@domain/interfaces/readingChallenge.interfaces';

export const readingChallengeObject: IReadingChallengeFromObject = {
    id: 1,
    userId: 1,
    year: 2026,
    goal: 20,
    createdAt: new Date('2026-01-02T10:00:00Z'),
    updatedAt: null,
};

export const readingChallengeEntity =
    ReadingChallengeEntity.fromObject(readingChallengeObject);

export const readingChallengeKey: IReadingChallengeKey = {
    userId: readingChallengeObject.userId,
    year: readingChallengeObject.year,
};

export const readingChallengeData: IReadingChallengeData = {
    ...readingChallengeKey,
    goal: readingChallengeObject.goal,
};
