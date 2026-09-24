import {IFinishedReading} from '@domain/interfaces/readingSession.interfaces';

export interface IReadingChallengeFromObject {
    id: number;
    userId: number;
    year: number;
    goal: number;
    createdAt: Date;
    updatedAt: Date | null;
}

export interface IReadingChallengeKey {
    userId: number;
    year: number;
}

export interface IReadingChallengeData extends IReadingChallengeKey {
    goal: number;
}

export interface ICreateReadingChallengeDto {
    year?: number | string;
    goal?: number | string;
}

export interface IUpdateReadingChallengeDto {
    year?: number | string;
    goal?: number | string;
}

export interface IReadingChallengeYearDto {
    year?: number | string;
}

export type ReadingChallengeStatus = 'AHEAD' | 'ON_TRACK' | 'BEHIND' | 'COMPLETED';

/** Goal-dependent numbers; only present when the user set a goal for that year. */
export interface IReadingChallengeGoalProgress {
    remaining: number;
    percentage: number;
    expectedByNow: number;
    status: ReadingChallengeStatus;
    booksAheadOrBehind: number;
    booksPerMonthNeeded: number | null;
}

export interface IReadingChallengeProgress {
    year: number;
    goal: number | null;
    booksRead: number;
    monthly: number[];
    books: IFinishedReading[];
    progress: IReadingChallengeGoalProgress | null;
}

export interface IReadingChallengeSummary {
    year: number;
    goal: number;
    booksRead: number;
    percentage: number;
    completed: boolean;
}
