import {
    CreateReadingChallengeDto,
    ReadingChallengeYearDto,
    UpdateReadingChallengeDto,
} from '@domain/dtos';
import {CustomError} from '@domain/errors/custom.error';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {
    CreateReadingChallenge,
    DeleteReadingChallenge,
    UpdateReadingChallenge,
} from '@domain/use-cases';
import {readingChallengeData, readingChallengeEntity} from '@tests/fixtures';

describe('readingChallenge use cases', () => {
    const repository: jest.Mocked<ReadingChallengeRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    const {userId, year, goal} = readingChallengeData;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('CreateReadingChallenge should create the challenge for the authenticated user', async () => {
        repository.create.mockResolvedValue(readingChallengeEntity);

        const result = await new CreateReadingChallenge(repository).execute(
            new CreateReadingChallengeDto(year, goal),
            userId
        );

        expect(result).toBe(readingChallengeEntity);
        expect(repository.create).toHaveBeenCalledWith({userId, year, goal});
    });

    test('UpdateReadingChallenge should update the goal of the authenticated user challenge', async () => {
        repository.update.mockResolvedValue(readingChallengeEntity);

        const result = await new UpdateReadingChallenge(repository).execute(
            new UpdateReadingChallengeDto(year, goal),
            userId
        );

        expect(result).toBe(readingChallengeEntity);
        expect(repository.update).toHaveBeenCalledWith({userId, year, goal});
    });

    test('DeleteReadingChallenge should delete the authenticated user challenge', async () => {
        repository.delete.mockResolvedValue(readingChallengeEntity);

        const result = await new DeleteReadingChallenge(repository).execute(
            new ReadingChallengeYearDto(year),
            userId
        );

        expect(result).toBe(readingChallengeEntity);
        expect(repository.delete).toHaveBeenCalledWith({userId, year});
    });

    test('should propagate repository errors', async () => {
        const error = CustomError.badRequest(
            'A reading challenge for this year already exists'
        );
        repository.create.mockRejectedValue(error);

        await expect(
            new CreateReadingChallenge(repository).execute(
                new CreateReadingChallengeDto(year, goal),
                userId
            )
        ).rejects.toBe(error);
    });
});
