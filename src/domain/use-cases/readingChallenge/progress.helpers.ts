import {ReadingChallengeEntity} from '@domain/entities';
import {
    IComputeChallengeProgressInput,
    IReadingChallengeGoalProgress,
    IReadingChallengeProgress,
    IReadingChallengeSummary,
    ReadingChallengeStatus,
} from '@domain/interfaces/readingChallenge.interfaces';
import {IDateRange, IFinishedReading} from '@domain/interfaces/readingSession.interfaces';

const MONTHS_IN_YEAR = 12;

/** The whole calendar year in UTC, as a half-open range [Jan 1, next Jan 1). */
export const getYearRange = (year: number): IDateRange => ({
    from: new Date(Date.UTC(year, 0, 1)),
    to: new Date(Date.UTC(year + 1, 0, 1)),
});

/** Share of the year elapsed at `now`: 0 before it starts, 1 once it has ended. */
export const getElapsedYearFraction = (year: number, now: Date): number => {
    const {from, to} = getYearRange(year);
    const elapsed = (now.getTime() - from.getTime()) / (to.getTime() - from.getTime());
    return Math.min(Math.max(elapsed, 0), 1);
};

/** Not capped at 100, so going past the goal shows as e.g. 110%. */
export const calculatePercentage = (booksRead: number, goal: number): number =>
    Math.round((booksRead / goal) * 100);

export const getMonthlyCounts = (books: IFinishedReading[]): number[] => {
    const monthly = Array.from({length: MONTHS_IN_YEAR}, () => 0);
    books.forEach(({finishedAt}) => {
        monthly[finishedAt.getUTCMonth()] += 1;
    });
    return monthly;
};

/** Within one book of the expected pace counts as on track. */
export const getStatus = (
    booksRead: number,
    goal: number,
    booksAheadOfPace: number
): ReadingChallengeStatus => {
    if (booksRead >= goal) return 'COMPLETED';
    if (Math.abs(booksAheadOfPace) < 1) return 'ON_TRACK';
    return booksAheadOfPace > 0 ? 'AHEAD' : 'BEHIND';
};

/** null once the year is over and books are still missing: there is no pace left. */
export const getBooksPerMonthNeeded = (
    remaining: number,
    monthsLeft: number
): number | null => {
    if (remaining === 0) return 0;
    if (monthsLeft <= 0) return null;
    return Math.round((remaining / monthsLeft) * 10) / 10;
};

export const computeGoalProgress = (
    goal: number,
    booksRead: number,
    elapsedYearFraction: number
): IReadingChallengeGoalProgress => {
    const remaining = Math.max(goal - booksRead, 0);
    const expectedByNow = goal * elapsedYearFraction;
    const booksAheadOfPace = booksRead - expectedByNow;
    const monthsLeft = (1 - elapsedYearFraction) * MONTHS_IN_YEAR;

    return {
        remaining,
        percentage: calculatePercentage(booksRead, goal),
        expectedByNow: Math.round(expectedByNow),
        status: getStatus(booksRead, goal, booksAheadOfPace),
        // `|| 0` turns -0 into 0
        booksAheadOrBehind: Math.trunc(booksAheadOfPace) || 0,
        booksPerMonthNeeded: getBooksPerMonthNeeded(remaining, monthsLeft),
    };
};

export const computeChallengeProgress = ({
    year,
    goal,
    books,
    now,
}: IComputeChallengeProgressInput): IReadingChallengeProgress => ({
    year,
    goal,
    booksRead: books.length,
    monthly: getMonthlyCounts(books),
    books,
    progress:
        goal === null
            ? null
            : computeGoalProgress(goal, books.length, getElapsedYearFraction(year, now)),
});

export const summarizeChallenge = (
    {year, goal}: ReadingChallengeEntity,
    booksRead: number
): IReadingChallengeSummary => ({
    year,
    goal,
    booksRead,
    percentage: calculatePercentage(booksRead, goal),
    completed: booksRead >= goal,
});
