export const BOOK_DTO_ERRORS = {
    SEARCH_BOOK: {
        SEARCH_TEXT: {
            REQUIRED: 'searchText is required',
            BLANK_SPACES: 'searchText cannot contain only blank spaces',
        },
        PAGE: {NUMBER: 'page must be a number',},
        PRINT_TYPE: {TYPE: 'printType must be all, books or magazines',},
        MAX_RESULTS: {NUMBER: 'maxResults must be a number',}
    },
    CREATE_BOOK: {
        SUBTITLE: {
            STRING: 'subtitle must be a string',
            MIN_LENGTH: 'subtitle must contain at least 3 characters long',
            MAX_LENGTH: 'subtitle must contain at last 100 characters long',
        },
        PUBLISHED_DATE: {
            REQUIRED: 'publishedDate is required and must be Date type or null',
        },
        AVERAGE_RATING: {
            REQUIRED: 'avarageRating is required',
            NUMBER: 'avarageRating must be a number',
        },
        REVIEW_COUNT: {
            REQUIRED: 'reviewCount is required',
            NUMBER: 'reviewCount must be a number',
        },
        PAGE_COUNT: {
            REQUIRED: 'pageCount is required',
            NUMBER: 'pageCount must be a number',
        },
        
    }
}