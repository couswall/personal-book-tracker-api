import {
    CreateReadingChallengeDto,
    ReadingChallengeYearDto,
    UpdateReadingChallengeDto,
} from '@domain/dtos';
import {INVALID_OBJECT_ERROR} from '@domain/constants/bookshelfBook.constants';
import {READING_CHALLENGE_DTO_ERRORS} from '@domain/constants/readingChallenge.constants';

describe('readingChallenge DTOs', () => {
    const {YEAR, GOAL} = READING_CHALLENGE_DTO_ERRORS;
    const now = new Date('2026-09-24T12:00:00Z');

    describe('CreateReadingChallengeDto.create()', () => {
        test('should default the year to the current UTC year', () => {
            const [error, dto] = CreateReadingChallengeDto.create({goal: 20}, now);

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(CreateReadingChallengeDto);
            expect(dto).toEqual({year: 2026, goal: 20});
        });

        test('should accept next year and numeric strings', () => {
            const [error, dto] = CreateReadingChallengeDto.create(
                {year: '2027', goal: '30'},
                now
            );

            expect(error).toBeUndefined();
            expect(dto).toEqual({year: 2027, goal: 30});
        });

        test('should reject a past year', () => {
            expect(CreateReadingChallengeDto.create({year: 2025, goal: 20}, now)).toEqual(
                [YEAR.NOT_EDITABLE]
            );
        });

        test('should reject a missing or invalid goal', () => {
            expect(CreateReadingChallengeDto.create({}, now)).toEqual([GOAL.REQUIRED]);
            expect(CreateReadingChallengeDto.create({goal: 0}, now)).toEqual([
                GOAL.INVALID,
            ]);
        });

        test('should return an error when the object is missing', () => {
            expect(CreateReadingChallengeDto.create(undefined, now)).toEqual([
                INVALID_OBJECT_ERROR,
            ]);
        });
    });

    describe('UpdateReadingChallengeDto.create()', () => {
        test('should return a dto for an editable year and valid goal', () => {
            const [error, dto] = UpdateReadingChallengeDto.create(
                {year: '2026', goal: 25},
                now
            );

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(UpdateReadingChallengeDto);
            expect(dto).toEqual({year: 2026, goal: 25});
        });

        test('should require the year (no default for updates)', () => {
            expect(UpdateReadingChallengeDto.create({goal: 25}, now)).toEqual([
                YEAR.REQUIRED,
            ]);
        });

        test('should not allow changing a past challenge', () => {
            expect(UpdateReadingChallengeDto.create({year: 2025, goal: 25}, now)).toEqual(
                [YEAR.NOT_EDITABLE]
            );
        });

        test('should reject an invalid goal', () => {
            expect(
                UpdateReadingChallengeDto.create({year: 2026, goal: 1001}, now)
            ).toEqual([GOAL.INVALID]);
        });

        test('should return an error when the object is missing', () => {
            expect(UpdateReadingChallengeDto.create(undefined, now)).toEqual([
                INVALID_OBJECT_ERROR,
            ]);
        });
    });

    describe('ReadingChallengeYearDto.create()', () => {
        test('should accept any valid year, including past ones', () => {
            const [error, dto] = ReadingChallengeYearDto.create({year: '2019'});

            expect(error).toBeUndefined();
            expect(dto).toBeInstanceOf(ReadingChallengeYearDto);
            expect(dto?.year).toBe(2019);
        });

        test('should reject an invalid year', () => {
            expect(ReadingChallengeYearDto.create({year: 'abc'})).toEqual([YEAR.INVALID]);
        });

        test('should return an error when the object is missing', () => {
            expect(ReadingChallengeYearDto.create(undefined)).toEqual([
                INVALID_OBJECT_ERROR,
            ]);
        });
    });
});
