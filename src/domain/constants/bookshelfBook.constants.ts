export const BOOKSHELF_BOOK_DTO_ERRORS = {
    ADD_TO_BOOKSHELF: {
        API_BOOK_ID: {
            REQUIRED: 'apiBookId is required',
            STRING: 'apiBookId must be a string',
            MIN_LENGTH: 'apiBookId must contain at least 3 characters long',
            MAX_LENGTH: 'apiBookId must contain at last 15 characters long',
            BLANK_SPACES: 'apiBookId must not contain only blankspaces'
        },
    },
};

export const INVALID_OBJECT_ERROR = 'Invalid object';