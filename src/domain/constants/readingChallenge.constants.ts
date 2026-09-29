export const READING_CHALLENGE_GOAL = {
    MIN: 1,
    MAX: 1000,
};

export const READING_CHALLENGE_YEAR = {
    MIN: 1000,
    MAX: 9999,
};

export const READING_CHALLENGE_DTO_ERRORS = {
    YEAR: {
        REQUIRED: 'year is required',
        INVALID: 'year must be a valid four-digit year',
        NOT_EDITABLE: 'Only the current and next year reading challenges can be set',
    },
    GOAL: {
        REQUIRED: 'goal is required',
        INVALID: `goal must be a whole number between ${READING_CHALLENGE_GOAL.MIN} and ${READING_CHALLENGE_GOAL.MAX}`,
    },
};
