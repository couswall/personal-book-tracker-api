import {
    parseEditableYear,
    parseGoal,
    parseYear,
} from '@domain/dtos/readingChallenge/helpers';
import {READING_CHALLENGE_DTO_ERRORS} from '@domain/constants/readingChallenge.constants';

describe('readingChallenge dto helpers', () => {
    const {YEAR, GOAL} = READING_CHALLENGE_DTO_ERRORS;
    const now = new Date('2026-09-24T12:00:00Z');

    describe('parseYear()', () => {
        test.each([2026, '2026', 1999, 9999])('should accept the year %s', (year) => {
            expect(parseYear(year)).toEqual([undefined, Number(year)]);
        });

        test.each([undefined, ''])('should require a year (%s)', (year) => {
            expect(parseYear(year)).toEqual([YEAR.REQUIRED]);
        });

        test.each(['abc', 2026.5, 999, 10000, -2026])(
            'should reject the invalid year %s',
            (year) => {
                expect(parseYear(year)).toEqual([YEAR.INVALID]);
            }
        );
    });

    describe('parseEditableYear()', () => {
        test('should accept the current year', () => {
            expect(parseEditableYear(2026, now)).toEqual([undefined, 2026]);
        });

        test('should accept next year', () => {
            expect(parseEditableYear('2027', now)).toEqual([undefined, 2027]);
        });

        test.each([2025, 2028])('should reject the year %s', (year) => {
            expect(parseEditableYear(year, now)).toEqual([YEAR.NOT_EDITABLE]);
        });

        test('should return format errors before range errors', () => {
            expect(parseEditableYear('abc', now)).toEqual([YEAR.INVALID]);
        });
    });

    describe('parseGoal()', () => {
        test.each([1, 20, '52', 1000])('should accept the goal %s', (goal) => {
            expect(parseGoal(goal)).toEqual([undefined, Number(goal)]);
        });

        test.each([undefined, ''])('should require a goal (%s)', (goal) => {
            expect(parseGoal(goal)).toEqual([GOAL.REQUIRED]);
        });

        test.each([0, -5, 1001, 12.5, 'twenty'])('should reject the goal %s', (goal) => {
            expect(parseGoal(goal)).toEqual([GOAL.INVALID]);
        });
    });
});
