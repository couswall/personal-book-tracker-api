import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
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

describe('readingChallenge.repository tests', () => {
    class MockReadingChallengeRepository implements ReadingChallengeRepository {
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

    const repository = new MockReadingChallengeRepository();

    test('abstract class should include all its methods', () => {
        expect(typeof repository.create).toBe('function');
        expect(typeof repository.update).toBe('function');
        expect(typeof repository.delete).toBe('function');
    });

    test.each([
        ['create', () => repository.create(readingChallengeData)],
        ['update', () => repository.update(readingChallengeData)],
        ['delete', () => repository.delete(readingChallengeKey)],
    ])('%s() should return a ReadingChallengeEntity', async (_name, call) => {
        await expect(call()).resolves.toBeInstanceOf(ReadingChallengeEntity);
    });
});
