import {ReadingChallengeDatasource} from '@domain/datasources/readingChallenge.datasource';
import {ReadingChallengeRepositoryImpl} from '@infrastructure/repositories/readingChallenge.repository.impl';
import {
    readingChallengeData,
    readingChallengeEntity,
    readingChallengeKey,
} from '@tests/fixtures';

describe('readingChallenge.repository.impl tests', () => {
    const mockDatasource: jest.Mocked<ReadingChallengeDatasource> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByYear: jest.fn(),
        findAllByUser: jest.fn(),
    };
    const repository = new ReadingChallengeRepositoryImpl(mockDatasource);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('create() should call datasource.create() and return its result', async () => {
        mockDatasource.create.mockResolvedValue(readingChallengeEntity);

        const result = await repository.create(readingChallengeData);

        expect(result).toBe(readingChallengeEntity);
        expect(mockDatasource.create).toHaveBeenCalledWith(readingChallengeData);
    });

    test('update() should call datasource.update() and return its result', async () => {
        mockDatasource.update.mockResolvedValue(readingChallengeEntity);

        const result = await repository.update(readingChallengeData);

        expect(result).toBe(readingChallengeEntity);
        expect(mockDatasource.update).toHaveBeenCalledWith(readingChallengeData);
    });

    test('delete() should call datasource.delete() and return its result', async () => {
        mockDatasource.delete.mockResolvedValue(readingChallengeEntity);

        const result = await repository.delete(readingChallengeKey);

        expect(result).toBe(readingChallengeEntity);
        expect(mockDatasource.delete).toHaveBeenCalledWith(readingChallengeKey);
    });

    test('findByYear() should call datasource.findByYear() and return its result', async () => {
        mockDatasource.findByYear.mockResolvedValue(readingChallengeEntity);

        const result = await repository.findByYear(readingChallengeKey);

        expect(result).toBe(readingChallengeEntity);
        expect(mockDatasource.findByYear).toHaveBeenCalledWith(readingChallengeKey);
    });

    test('findAllByUser() should call datasource.findAllByUser() and return its result', async () => {
        mockDatasource.findAllByUser.mockResolvedValue([readingChallengeEntity]);

        const result = await repository.findAllByUser(readingChallengeKey.userId);

        expect(result).toEqual([readingChallengeEntity]);
        expect(mockDatasource.findAllByUser).toHaveBeenCalledWith(
            readingChallengeKey.userId
        );
    });
});
