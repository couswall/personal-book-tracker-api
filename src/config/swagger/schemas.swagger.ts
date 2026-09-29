export const swaggerSchemas = {
    UserResponse: {
        type: 'object',
        properties: {
            id: {type: 'integer', example: 1},
            fullName: {type: 'string', example: 'John Doe'},
            username: {type: 'string', example: 'john_doe'},
            email: {type: 'string', example: 'john@example.com'},
            createdAt: {type: 'string', format: 'date-time'},
        },
    },
    BookshelfResponse: {
        type: 'object',
        properties: {
            id: {type: 'integer', example: 1},
            name: {type: 'string', example: 'Currently Reading'},
            type: {type: 'string', example: 'READING'},
            createdAt: {type: 'string', format: 'date-time'},
        },
    },
    BookshelfWithStatus: {
        type: 'object',
        properties: {
            id: {type: 'integer', example: 1},
            name: {type: 'string', example: 'Currently Reading'},
            type: {
                type: 'string',
                enum: ['READ', 'CURRENTLY_READING', 'TO_BE_READ'],
                example: 'CURRENTLY_READING',
            },
            isSelected: {type: 'boolean', example: true},
            bookshelfBookId: {type: 'integer', nullable: true, example: 5},
            bookCount: {type: 'integer', example: 1},
            readingProgress: {type: 'number', nullable: true, example: 50},
            currentPage: {type: 'integer', nullable: true, example: 120},
            progressType: {
                type: 'string',
                nullable: true,
                enum: ['PAGE', 'PERCENTAGE'],
                example: 'PAGE',
            },
            finishedAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: null,
                description:
                    'Only on the READ shelf when the book is on it: when it was last finished (null = unknown date, so it counts toward no challenge).',
            },
            hasChallenge: {
                type: 'boolean',
                example: false,
                description:
                    "Only true on the READ shelf when the book is on it and the user set a reading challenge for finishedAt's year. Use it to warn that moving or removing the book affects that challenge.",
            },
        },
    },
    BookshelfBookResponse: {
        type: 'object',
        properties: {
            id: {type: 'integer', example: 5},
            bookshelfId: {type: 'integer', example: 1},
            bookId: {type: 'integer', example: 42},
            readingProgress: {type: 'number', example: 0},
            currentPage: {type: 'integer', nullable: true, example: null},
            totalPages: {type: 'integer', nullable: true, example: 320},
            progressType: {
                type: 'string',
                nullable: true,
                enum: ['PAGE', 'PERCENTAGE'],
                example: null,
            },
        },
    },
    ReadingChallengeResponse: {
        type: 'object',
        properties: {
            id: {type: 'integer', example: 1},
            year: {type: 'integer', example: 2026},
            goal: {type: 'integer', example: 20},
            createdAt: {type: 'string', format: 'date-time'},
            updatedAt: {type: 'string', format: 'date-time', nullable: true},
        },
    },
    BookSummary: {
        type: 'object',
        properties: {
            apiBookId: {type: 'string', example: 'OXf3o_EBrxYC'},
            title: {type: 'string', example: 'Clean Code'},
            authors: {
                type: 'array',
                items: {type: 'string'},
                example: ['Robert C. Martin'],
            },
            thumbnail: {type: 'string', nullable: true},
        },
    },
    BookDetail: {
        type: 'object',
        properties: {
            apiBookId: {type: 'string', example: 'OXf3o_EBrxYC'},
            title: {type: 'string', example: 'Clean Code'},
            authors: {type: 'array', items: {type: 'string'}},
            description: {type: 'string', nullable: true},
            pageCount: {type: 'integer', nullable: true, example: 431},
            categories: {type: 'array', items: {type: 'string'}},
            thumbnail: {type: 'string', nullable: true},
            language: {type: 'string', example: 'en'},
            publishedDate: {type: 'string', nullable: true},
        },
    },
    FinishedReading: {
        type: 'object',
        properties: {
            sessionId: {type: 'integer', example: 12},
            bookId: {type: 'integer', example: 4},
            title: {type: 'string', example: 'Clean Code'},
            coverImageUrl: {type: 'string', nullable: true},
            finishedAt: {type: 'string', format: 'date-time'},
        },
    },
    ReadingChallengeProgress: {
        type: 'object',
        properties: {
            year: {type: 'integer', example: 2026},
            goal: {
                type: 'integer',
                nullable: true,
                example: 20,
                description: 'null when no goal was set for that year',
            },
            booksRead: {type: 'integer', example: 13},
            monthly: {
                type: 'array',
                items: {type: 'integer'},
                description: 'Books finished per month, January first',
                example: [2, 1, 3, 0, 1, 2, 1, 2, 1, 0, 0, 0],
            },
            books: {type: 'array', items: {$ref: '#/components/schemas/FinishedReading'}},
            progress: {$ref: '#/components/schemas/ReadingChallengeGoalProgress'},
        },
    },
    ReadingChallengeGoalProgress: {
        type: 'object',
        nullable: true,
        description: 'null when no goal was set for that year',
        properties: {
            remaining: {type: 'integer', example: 7},
            percentage: {type: 'integer', example: 65},
            expectedByNow: {type: 'integer', example: 14},
            status: {
                type: 'string',
                enum: ['AHEAD', 'ON_TRACK', 'BEHIND', 'COMPLETED'],
                example: 'ON_TRACK',
            },
            booksAheadOrBehind: {type: 'integer', example: -1},
            booksPerMonthNeeded: {type: 'number', nullable: true, example: 2.3},
            projectedFinishDate: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '2026-11-12T00:00:00.000Z',
                description:
                    'Day the goal is reached at the current pace; null with no books yet, goal met, or a finish past the year',
            },
        },
    },
    ReadingChallengeSummary: {
        type: 'object',
        properties: {
            year: {type: 'integer', example: 2025},
            goal: {type: 'integer', example: 24},
            booksRead: {type: 'integer', example: 26},
            percentage: {type: 'integer', example: 108},
            completed: {type: 'boolean', example: true},
        },
    },
};
