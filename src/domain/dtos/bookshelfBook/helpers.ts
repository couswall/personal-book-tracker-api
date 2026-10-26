import {regularExps} from '@config/regular-exp';
import {BOOKSHELF_BOOK_DTO_ERRORS} from '@domain/constants/bookshelfBook.constants';
import {ReadingProgressType} from '@domain/interfaces/bookshelfBook.interfaces';

export const isReadingProgressType = (value?: string): value is ReadingProgressType =>
    value === 'PAGE' || value === 'PERCENTAGE';

/**
 * Parses a date-only "YYYY-MM-DD" string into a Date at UTC midnight.
 * undefined → not provided, null → date unknown.
 * Dates up to tomorrow (UTC) are accepted, since clients in time zones
 * ahead of UTC may already be on the next day.
 */
export const parseFinishedAt = (
    finishedAt?: string | null,
    now: Date = new Date()
): [string?, (Date | null)?] => {
    if (finishedAt === undefined) return [undefined, undefined];
    if (finishedAt === null) return [undefined, null];

    const {INVALID, FUTURE} = BOOKSHELF_BOOK_DTO_ERRORS.FINISHED_AT;
    const match = typeof finishedAt === 'string' && regularExps.dateOnly.exec(finishedAt);
    if (!match) return [INVALID];

    const [year, month, day] = match.slice(1).map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const isRealDate =
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day;
    if (!isRealDate) return [INVALID];

    const tomorrow = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1
    );
    if (date.getTime() > tomorrow) return [FUTURE];

    return [undefined, date];
};
