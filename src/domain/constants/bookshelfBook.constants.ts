export const BOOKSHELF_BOOK_DTO_ERRORS = {
    ADD_TO_BOOKSHELF: {
        API_BOOK_ID: {
            REQUIRED: 'apiBookId is required',
            STRING: 'apiBookId must be a string',
            MIN_LENGTH: 'apiBookId must contain at least 3 characters long',
            MAX_LENGTH: 'apiBookId must contain at last 15 characters long',
            BLANK_SPACES: 'apiBookId must not contain only blankspaces',
        },
    },
    UPDATE_READING_PROGRESS: {
        PROGRESS_TYPE: {
            REQUIRED: 'progressType is required',
            INVALID: 'progressType must be either PAGE or PERCENTAGE',
        },
        IS_FINISHED: {
            BOOLEAN: 'isFinished must be a boolean',
        },
    },
};

export const INVALID_OBJECT_ERROR = 'Invalid object';
