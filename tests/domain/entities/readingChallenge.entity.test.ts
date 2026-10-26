import {ReadingChallengeEntity} from '@domain/entities';
import {readingChallengeObject} from '@tests/fixtures';

describe('readingChallenge.entity tests', () => {
    test('should create a ReadingChallengeEntity from valid properties', () => {
        const {id, userId, year, goal, createdAt, updatedAt} = readingChallengeObject;

        const entity = new ReadingChallengeEntity(
            id,
            userId,
            year,
            goal,
            createdAt,
            updatedAt
        );

        expect(entity).toBeInstanceOf(ReadingChallengeEntity);
        expect(entity).toEqual(readingChallengeObject);
    });

    test('fromObject() should create a ReadingChallengeEntity from a valid object', () => {
        const entity = ReadingChallengeEntity.fromObject(readingChallengeObject);

        expect(entity).toBeInstanceOf(ReadingChallengeEntity);
        expect(entity).toEqual(readingChallengeObject);
    });
});
