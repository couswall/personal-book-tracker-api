import {IReadingChallengeSummary} from '@domain/interfaces/readingChallenge.interfaces';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {GetReadingChallengeHistoryUseCase} from '@domain/use-cases/interfaces/readingChallenge.interfaces';
import {
    getYearRange,
    summarizeChallenge,
} from '@domain/use-cases/readingChallenge/progress.helpers';

/** Every challenge the user has set, newest year first, with how it went. */
export class GetReadingChallengeHistory implements GetReadingChallengeHistoryUseCase {
    constructor(
        private readonly repository: ReadingChallengeRepository,
        private readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    async execute(userId: number): Promise<IReadingChallengeSummary[]> {
        const challenges = await this.repository.findAllByUser(userId);

        return Promise.all(
            challenges.map(async (challenge) => {
                const booksRead =
                    await this.readingSessionRepository.countFinishedInRange(
                        userId,
                        getYearRange(challenge.year)
                    );
                return summarizeChallenge(challenge, booksRead);
            })
        );
    }
}
