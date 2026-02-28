
export const ERROR_MESSAGES = {
    USER: {
        LOGIN: {
            INVALID_CREDENTIALS: 'Invalid credentials',
        },
        CREATE: {
            EXISTING_USERNAME: 'User with provided username already exists',
            EXISTING_EMAIL: 'User with provided email already exists',
        },
        GET_BY_ID:{
            NO_EXISTING: 'User with the provided ID not found.'
        }
    },
    TOKEN: {
        CREATING: 'Error while creating token',
        INVALID: 'Invalid or expired token',
        NO_TOKEN: 'No token sent',
        INVALID_USER: 'Invalid token - user',
    },
    EXTERNAL_BOOKS_API:{
        INTERNAL: 'Google books API error',
    },
    BOOKSHELF: {
        CREATE_CUSTOM:{
            EXISTING: 'A booksheld with that name already exists',
        },
        GET_BOOKSHELF_BY_ID:{
            NOT_FOUND: 'Bookshelf with provided ID does not exist'
        }
    },
    BOOK: {
        GET_BOOK_BY_ID: {
            NOT_FOUND: 'Book with provided ID does not exist',
        },
        CREATE: {
            EXISTING: 'A book with provided apiBookId already exists',
        }
    },
    BOOKSHELF_BOOK:{
        ADD_TO_BOOKSHELF:{
            ALREADY_ADDED: 'This book has already been added to a bookshelf.',
            INVALID_READING_STATUS: 'Invalid reading status ID',
        },
        UPDATE_BOOKSHELF:{
            NOT_FOUND: 'Bookshelf book with provided ID does not exist',
        }
    }
}