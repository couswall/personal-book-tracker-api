import {ReadingChallengeYearDto} from '@domain/dtos';
import {ReadingChallengeEntity} from '@domain/entities';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {GetReadingChallengeHistory, GetReadingChallengeProgress} from '@domain/use-cases';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {finishedReadingObject, readingChallengeEntity} from '@tests/fixtures';

describe('readingChallenge progress use cases', () => {
    const repository: jest.Mocked<ReadingChallengeRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByYear: jest.fn(),
        findAllByUser: jest.fn(),
    };
    const {mockReadingSessionRepository: sessions} = getMockRepositories();
    const {userId} = readingChallengeEntity;
    const year2026 = {
        from: new Date('2026-01-01T00:00:00Z'),
        to: new Date('2027-01-01T00:00:00Z'),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GetReadingChallengeProgress', () => {
        const now = new Date('2026-07-02T12:00:00Z');
        const execute = () =>
            new GetReadingChallengeProgress(repository, sessions).execute(
                new ReadingChallengeYearDto(2026),
                userId,
                now
            );

        test('should combine the goal with the books finished that year', async () => {
            repository.findByYear.mockResolvedValue(readingChallengeEntity);
            sessions.getFinishedInRange.mockResolvedValue([finishedReadingObject]);

            const result = await execute();

            expect(repository.findByYear).toHaveBeenCalledWith({userId, year: 2026});
            expect(sessions.getFinishedInRange).toHaveBeenCalledWith(userId, year2026);
            expect(result).toMatchObject({
                year: 2026,
                goal: readingChallengeEntity.goal,
                booksRead: 1,
                books: [finishedReadingObject],
                progress: {remaining: 19, expectedByNow: 10, status: 'BEHIND'},
            });
        });

        test('should return books read but no progress when no goal was set', async () => {
            repository.findByYear.mockResolvedValue(null);
            sessions.getFinishedInRange.mockResolvedValue([finishedReadingObject]);

            const result = await execute();

            expect(result.goal).toBeNull();
            expect(result.booksRead).toBe(1);
            expect(result.progress).toBeNull();
        });
    });

    describe('GetReadingChallengeHistory', () => {
        test('should summarize every challenge with the books read that year', async () => {
            const challenge2025 = ReadingChallengeEntity.fromObject({
                ...readingChallengeEntity,
                id: 2,
                year: 2025,
                goal: 10,
            });
            repository.findAllByUser.mockResolvedValue([
                readingChallengeEntity,
                challenge2025,
            ]);
            sessions.countFinishedInRange.mockImplementation(async (_userId, {from}) =>
                from.getUTCFullYear() === 2026 ? 5 : 12
            );

            const result = await new GetReadingChallengeHistory(
                repository,
                sessions
            ).execute(userId);

            expect(repository.findAllByUser).toHaveBeenCalledWith(userId);
            expect(sessions.countFinishedInRange).toHaveBeenCalledWith(userId, year2026);
            expect(result).toEqual([
                {year: 2026, goal: 20, booksRead: 5, percentage: 25, completed: false},
                {year: 2025, goal: 10, booksRead: 12, percentage: 120, completed: true},
            ]);
        });

        test('should return an empty list when the user never set a challenge', async () => {
            repository.findAllByUser.mockResolvedValue([]);

            const result = await new GetReadingChallengeHistory(
                repository,
                sessions
            ).execute(userId);

            expect(result).toEqual([]);
            expect(sessions.countFinishedInRange).not.toHaveBeenCalled();
        });
    });
});
