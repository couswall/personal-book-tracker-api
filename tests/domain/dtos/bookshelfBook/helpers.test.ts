import {parseFinishedAt} from '@domain/dtos/bookshelfBook/helpers';
import {BOOKSHELF_BOOK_DTO_ERRORS} from '@domain/constants/bookshelfBook.constants';

describe('bookshelfBook dto helpers', () => {
    describe('parseFinishedAt()', () => {
        const {INVALID, FUTURE} = BOOKSHELF_BOOK_DTO_ERRORS.FINISHED_AT;
        const now = new Date('2026-09-23T18:00:00Z');

        test('should return undefined when finishedAt is not provided', () => {
            expect(parseFinishedAt(undefined, now)).toEqual([undefined, undefined]);
        });

        test('should return null when finishedAt is null (date unknown)', () => {
            expect(parseFinishedAt(null, now)).toEqual([undefined, null]);
        });

        test('should parse a YYYY-MM-DD string as UTC midnight', () => {
            expect(parseFinishedAt('2026-03-15', now)).toEqual([
                undefined,
                new Date('2026-03-15T00:00:00Z'),
            ]);
        });

        test('should accept Dec 31 as the last day of that year', () => {
            const [, date] = parseFinishedAt('2025-12-31', now);

            expect(date?.getUTCFullYear()).toBe(2025);
        });

        test('should accept today and tomorrow (UTC) for time zones ahead of UTC', () => {
            expect(parseFinishedAt('2026-09-23', now)[0]).toBeUndefined();
            expect(parseFinishedAt('2026-09-24', now)[0]).toBeUndefined();
        });

        test('should reject dates after tomorrow (UTC)', () => {
            expect(parseFinishedAt('2026-09-25', now)).toEqual([FUTURE]);
        });

        test.each(['2026-02-30', '2026-13-01', '2025-02-29', '0099-01-01'])(
            'should reject the non-existent date %s',
            (value) => {
                expect(parseFinishedAt(value, now)).toEqual([INVALID]);
            }
        );

        test.each(['15/03/2026', '2026-3-15', '2026-03-15T10:00:00Z', '', 'yesterday'])(
            'should reject the badly formatted value "%s"',
            (value) => {
                expect(parseFinishedAt(value, now)).toEqual([INVALID]);
            }
        );

        test('should reject non-string values', () => {
            const body: {finishedAt?: string | null} = JSON.parse(
                '{"finishedAt": 20260315}'
            );

            expect(parseFinishedAt(body.finishedAt, now)).toEqual([INVALID]);
        });
    });
});
