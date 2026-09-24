import {ReadingChallengeDatasource} from '@domain/datasources/readingChallenge.datasource';
import {ReadingChallengeEntity} from '@domain/entities';
import {
    IReadingChallengeData,
    IReadingChallengeKey,
} from '@domain/interfaces/readingChallenge.interfaces';
import {
    readingChallengeData,
    readingChallengeEntity,
    readingChallengeKey,
} from '@tests/fixtures';

describe('readingChallenge.datasource tests', () => {
    class MockReadingChallengeDatasource implements ReadingChallengeDatasource {
        async create(_data: IReadingChallengeData): Promise<ReadingChallengeEntity> {
            return readingChallengeEntity;
        }
        async update(_data: IReadingChallengeData): Promise<ReadingChallengeEntity> {
            return readingChallengeEntity;
        }
        async delete(_key: IReadingChallengeKey): Promise<ReadingChallengeEntity> {
            return readingChallengeEntity;
        }
    }

    const datasource = new MockReadingChallengeDatasource();

    test('abstract class should include all its methods', () => {
        expect(typeof datasource.create).toBe('function');
        expect(typeof datasource.update).toBe('function');
        expect(typeof datasource.delete).toBe('function');
    });

    test.each([
        ['create', () => datasource.create(readingChallengeData)],
        ['update', () => datasource.update(readingChallengeData)],
        ['delete', () => datasource.delete(readingChallengeKey)],
    ])('%s() should return a ReadingChallengeEntity', async (_name, call) => {
        await expect(call()).resolves.toBeInstanceOf(ReadingChallengeEntity);
    });
});
