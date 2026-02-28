export const DTOS_ERRORS = {
    CREATE_USER: {
        FULLNAME: {
            REQUIRED: 'fullname is required',
            STRING: 'fullname must be a string',
            MIN_LENGTH: 'fullname must contain at least 3 character long',
            MAX_LENGTH: 'fullname must contain at last 40 characters long',
            BLANK_SPACES: 'fullname cannot contain only blank spaces',
            FORMAT: 'fullname can only contain letters and spaces'
        },
        USERNAME: {
            REQUIRED: 'username is required',
            STRING: 'username must be a string',
            MIN_LENGTH: 'username must contain at least three characters long',
            MAX_LENGTH: 'username must contain at last 30 characterS long',
            FORMAT: 'username can only include letters, numbers, dots and underscores'
        },
        EMAIL: {
            REQUIRED: 'email is required',
            STRING: 'email must be a string',
            FORMAT: 'Invalid email format',
        }, 
        PASSWORD: {
            REQUIRED: 'password is required',
            STRING: 'password must be a string',
            FORMAT: 'password must be at least 6 characters and include an uppercase letter, lowercase letter, number, and special character',  
        }
    },
    LOGIN_USER: {
        EMAIL_USERNAME: {
            REQUIRED: 'username or email field is required',
            STRING: 'username or email field must be a string',
            BLANK_SPACES: 'username or email field cannot contain only blank spaces'
        }
    },
    GET_BY_ID: {
        REQUIRED: 'id is required',
        NUMBER: 'id must be a number',
    }
}