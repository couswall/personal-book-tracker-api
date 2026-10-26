import {BookshelfType} from '@/generated/prisma';
import {ReadingChallengeYearDto} from '@domain/dtos';
import {DASHBOARD_PREVIEW_LIMITS} from '@domain/constants/dashboard.constants';
import {IDashboard} from '@domain/interfaces/dashboard.interfaces';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {GetDashboardUseCase} from '@domain/use-cases/interfaces/dashboard.interfaces';
import {GetReadingChallengeProgress} from '@domain/use-cases/readingChallenge/getProgress-readingChallenge';
import {
    getShelfTotal,
    toDashboardChallenge,
    toWantToReadBook,
} from '@domain/use-cases/dashboard/dashboard.helpers';

/** Everything the home dashboard shows, fetched in parallel in a single call. */
export class GetDashboard implements GetDashboardUseCase {
    constructor(
        private readonly bookshelfRepository: BookshelfRepository,
        private readonly readingChallengeRepository: ReadingChallengeRepository,
        private readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    async execute(userId: number, now: Date = new Date()): Promise<IDashboard> {
        const [shelves, currentlyReading, wantToRead, challenge] = await Promise.all([
            this.bookshelfRepository.getBookshelfCounts(userId),
            this.bookshelfRepository.getShelfBooks(
                userId,
                BookshelfType.CURRENTLY_READING,
                DASHBOARD_PREVIEW_LIMITS.CURRENTLY_READING
            ),
            this.bookshelfRepository.getShelfBooks(
                userId,
                BookshelfType.TO_BE_READ,
                DASHBOARD_PREVIEW_LIMITS.WANT_TO_READ
            ),
            new GetReadingChallengeProgress(
                this.readingChallengeRepository,
                this.readingSessionRepository
            ).execute(new ReadingChallengeYearDto(now.getUTCFullYear()), userId, now),
        ]);

        return {
            shelves,
            currentlyReading: {
                total: getShelfTotal(shelves, BookshelfType.CURRENTLY_READING),
                books: currentlyReading,
            },
            wantToRead: {
                total: getShelfTotal(shelves, BookshelfType.TO_BE_READ),
                books: wantToRead.map(toWantToReadBook),
            },
            readingChallenge: toDashboardChallenge(challenge, now),
        };
    }
}
