import {
    calculatePercentage,
    getBooksPerMonthNeeded,
    getElapsedYearFraction,
    getMonthlyCounts,
    getStatus,
    getYearRange,
} from '@domain/use-cases/readingChallenge/progress.helpers';
import {finishedReadingObject} from '@tests/fixtures';

const finishedOn = (isoDate: string) => ({
    ...finishedReadingObject,
    finishedAt: new Date(isoDate),
});

describe('readingChallenge progress helpers', () => {
    describe('getYearRange()', () => {
        test('should span Jan 1 (inclusive) to next Jan 1 (exclusive) in UTC', () => {
            expect(getYearRange(2026)).toEqual({
                from: new Date('2026-01-01T00:00:00Z'),
                to: new Date('2027-01-01T00:00:00Z'),
            });
        });
    });

    describe('getElapsedYearFraction()', () => {
        test('should be 0 before the year starts', () => {
            expect(getElapsedYearFraction(2026, new Date('2025-12-31T23:59:59Z'))).toBe(
                0
            );
        });

        test('should be 0.5 exactly halfway through a 365-day year', () => {
            expect(getElapsedYearFraction(2026, new Date('2026-07-02T12:00:00Z'))).toBe(
                0.5
            );
        });

        test('should account for leap years (366 days)', () => {
            expect(getElapsedYearFraction(2024, new Date('2024-07-02T00:00:00Z'))).toBe(
                0.5
            );
        });

        test('should be 1 once the year has ended', () => {
            expect(getElapsedYearFraction(2026, new Date('2027-01-01T00:00:00Z'))).toBe(
                1
            );
            expect(getElapsedYearFraction(2026, new Date('2030-06-01T00:00:00Z'))).toBe(
                1
            );
        });
    });

    describe('calculatePercentage()', () => {
        test.each([
            [13, 20, 65],
            [1, 3, 33],
            [0, 20, 0],
            [22, 20, 110],
        ])('%i of %i books should be %i%%', (booksRead, goal, expected) => {
            expect(calculatePercentage(booksRead, goal)).toBe(expected);
        });
    });

    describe('getMonthlyCounts()', () => {
        test('should count books per UTC month, January first', () => {
            const books = [
                finishedOn('2026-01-15T10:00:00Z'),
                finishedOn('2026-01-31T23:59:59Z'),
                finishedOn('2026-02-01T00:00:00Z'),
                finishedOn('2026-12-31T20:00:00Z'),
            ];

            expect(getMonthlyCounts(books)).toEqual([2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
        });

        test('should return twelve zeros when no books were read', () => {
            expect(getMonthlyCounts([])).toEqual(Array(12).fill(0));
        });
    });

    describe('getStatus()', () => {
        test('should be COMPLETED once the goal is reached, regardless of pace', () => {
            expect(getStatus(20, 20, -5)).toBe('COMPLETED');
            expect(getStatus(25, 20, 10)).toBe('COMPLETED');
        });

        test.each([0, 0.5, -0.9])(
            'should be ON_TRACK when within one book of pace (%s)',
            (booksAheadOfPace) => {
                expect(getStatus(10, 20, booksAheadOfPace)).toBe('ON_TRACK');
            }
        );

        test('should be AHEAD when at least one book ahead of pace', () => {
            expect(getStatus(11, 20, 1)).toBe('AHEAD');
        });

        test('should be BEHIND when at least one book behind pace', () => {
            expect(getStatus(8, 20, -2)).toBe('BEHIND');
        });
    });

    describe('getBooksPerMonthNeeded()', () => {
        test('should be 0 when nothing is left to read', () => {
            expect(getBooksPerMonthNeeded(0, 5)).toBe(0);
        });

        test('should round to one decimal', () => {
            expect(getBooksPerMonthNeeded(7, 3)).toBe(2.3);
            expect(getBooksPerMonthNeeded(10, 6)).toBe(1.7);
        });

        test('should be null when the year is over and books are still missing', () => {
            expect(getBooksPerMonthNeeded(7, 0)).toBeNull();
        });
    });
});
