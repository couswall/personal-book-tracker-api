import {ReadingChallengeYearDto} from '@domain/dtos';
import {IReadingChallengeProgress} from '@domain/interfaces/readingChallenge.interfaces';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {GetReadingChallengeProgressUseCase} from '@domain/use-cases/interfaces/readingChallenge.interfaces';
import {
    computeChallengeProgress,
    getYearRange,
} from '@domain/use-cases/readingChallenge/progress.helpers';

/**
 * Books read in a year and, when the user set a goal, their progress towards it.
 * Without a goal the books are still returned, so the client can invite the user to set one.
 */
export class GetReadingChallengeProgress implements GetReadingChallengeProgressUseCase {
    constructor(
        private readonly repository: ReadingChallengeRepository,
        private readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    async execute(
        {year}: ReadingChallengeYearDto,
        userId: number,
        now: Date = new Date()
    ): Promise<IReadingChallengeProgress> {
        const [challenge, books] = await Promise.all([
            this.repository.findByYear({userId, year}),
            this.readingSessionRepository.getFinishedInRange(userId, getYearRange(year)),
        ]);

        return computeChallengeProgress({
            year,
            goal: challenge?.goal ?? null,
            books,
            now,
        });
    }
}
