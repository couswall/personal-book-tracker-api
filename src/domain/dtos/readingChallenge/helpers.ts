import {isValidRequiredNumber} from '@domain/dtos/book/helpers';
import {
    READING_CHALLENGE_DTO_ERRORS,
    READING_CHALLENGE_GOAL,
    READING_CHALLENGE_YEAR,
} from '@domain/constants/readingChallenge.constants';

const {YEAR, GOAL} = READING_CHALLENGE_DTO_ERRORS;

const isWholeNumberBetween = (value: number, min: number, max: number): boolean =>
    Number.isInteger(value) && value >= min && value <= max;

export const parseYear = (year?: number | string): [string?, number?] => {
    if (year === undefined || year === null || year === '') return [YEAR.REQUIRED];

    const [error, parsedYear] = isValidRequiredNumber('year', year);
    if (
        error ||
        parsedYear === undefined ||
        !isWholeNumberBetween(
            parsedYear,
            READING_CHALLENGE_YEAR.MIN,
            READING_CHALLENGE_YEAR.MAX
        )
    )
        return [YEAR.INVALID];

    return [undefined, parsedYear];
};

/**
 * Challenges can only be set for the current or the next year (UTC).
 * Past challenges are kept as read-only history.
 */
export const parseEditableYear = (
    year: number | string | undefined,
    now: Date
): [string?, number?] => {
    const [error, parsedYear] = parseYear(year);
    if (error || parsedYear === undefined) return [error];

    const currentYear = now.getUTCFullYear();
    if (parsedYear !== currentYear && parsedYear !== currentYear + 1)
        return [YEAR.NOT_EDITABLE];

    return [undefined, parsedYear];
};

export const parseGoal = (goal?: number | string): [string?, number?] => {
    if (goal === undefined || goal === null || goal === '') return [GOAL.REQUIRED];

    const [error, parsedGoal] = isValidRequiredNumber('goal', goal);
    if (
        error ||
        parsedGoal === undefined ||
        !isWholeNumberBetween(
            parsedGoal,
            READING_CHALLENGE_GOAL.MIN,
            READING_CHALLENGE_GOAL.MAX
        )
    )
        return [GOAL.INVALID];

    return [undefined, parsedGoal];
};
