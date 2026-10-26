import {
    computeChallengeProgress,
    computeGoalProgress,
    summarizeChallenge,
} from '@domain/use-cases/readingChallenge/progress.helpers';
import {finishedReadingObject, readingChallengeEntity} from '@tests/fixtures';

const HALF_YEAR = 0.5;
const YEAR = 2026;

describe('readingChallenge progress computation', () => {
    describe('computeGoalProgress()', () => {
        test('should report AHEAD when above the expected pace', () => {
            expect(computeGoalProgress(YEAR, 20, 13, HALF_YEAR)).toEqual({
                remaining: 7,
                percentage: 65,
                expectedByNow: 10,
                status: 'AHEAD',
                booksAheadOrBehind: 3,
                booksPerMonthNeeded: 1.2,
                projectedFinishDate: new Date('2026-10-08T00:00:00Z'),
            });
        });

        test('should report BEHIND when below the expected pace', () => {
            expect(computeGoalProgress(YEAR, 20, 8, HALF_YEAR)).toEqual({
                remaining: 12,
                percentage: 40,
                expectedByNow: 10,
                status: 'BEHIND',
                booksAheadOrBehind: -2,
                booksPerMonthNeeded: 2,
                projectedFinishDate: null,
            });
        });

        test('should report ON_TRACK with 0 (not -0) books behind when less than a book off', () => {
            const progress = computeGoalProgress(YEAR, 20, 10, 0.525);

            expect(progress.status).toBe('ON_TRACK');
            expect(progress.expectedByNow).toBe(11);
            expect(progress.booksAheadOrBehind).toBe(0);
        });

        test('should report COMPLETED and allow going past 100%', () => {
            expect(computeGoalProgress(YEAR, 20, 25, HALF_YEAR)).toEqual({
                remaining: 0,
                percentage: 125,
                expectedByNow: 10,
                status: 'COMPLETED',
                booksAheadOrBehind: 15,
                booksPerMonthNeeded: 0,
                projectedFinishDate: null,
            });
        });

        test('should expect the whole goal for a finished year and no pace left', () => {
            expect(computeGoalProgress(YEAR, 20, 15, 1)).toEqual({
                remaining: 5,
                percentage: 75,
                expectedByNow: 20,
                status: 'BEHIND',
                booksAheadOrBehind: -5,
                booksPerMonthNeeded: null,
                projectedFinishDate: null,
            });
        });

        test('should expect nothing yet for a year that has not started', () => {
            expect(computeGoalProgress(YEAR, 24, 0, 0)).toEqual({
                remaining: 24,
                percentage: 0,
                expectedByNow: 0,
                status: 'ON_TRACK',
                booksAheadOrBehind: 0,
                booksPerMonthNeeded: 2,
                projectedFinishDate: null,
            });
        });
    });

    describe('computeChallengeProgress()', () => {
        const books = [
            {...finishedReadingObject, finishedAt: new Date('2026-03-15T00:00:00Z')},
            {...finishedReadingObject, finishedAt: new Date('2026-05-20T00:00:00Z')},
        ];
        const now = new Date('2026-07-02T12:00:00Z');

        test('should include goal progress when a goal is set', () => {
            const result = computeChallengeProgress({year: 2026, goal: 20, books, now});

            expect(result).toEqual({
                year: 2026,
                goal: 20,
                booksRead: 2,
                monthly: [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                books,
                progress: computeGoalProgress(YEAR, 20, 2, HALF_YEAR),
            });
        });

        test('should still count books but have no progress when no goal is set', () => {
            const result = computeChallengeProgress({year: 2026, goal: null, books, now});

            expect(result.goal).toBeNull();
            expect(result.booksRead).toBe(2);
            expect(result.books).toBe(books);
            expect(result.progress).toBeNull();
        });
    });

    describe('summarizeChallenge()', () => {
        test('should mark a challenge as completed when the goal was reached', () => {
            expect(summarizeChallenge(readingChallengeEntity, 22)).toEqual({
                year: readingChallengeEntity.year,
                goal: 20,
                booksRead: 22,
                percentage: 110,
                completed: true,
            });
        });

        test('should mark a challenge as not completed when short of the goal', () => {
            expect(summarizeChallenge(readingChallengeEntity, 5)).toMatchObject({
                booksRead: 5,
                percentage: 25,
                completed: false,
            });
        });
    });
});
