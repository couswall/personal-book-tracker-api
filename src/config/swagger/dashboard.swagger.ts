export const dashboardSchemas = {
    ShelfBook: {
        type: 'object',
        properties: {
            bookshelfBookId: {type: 'integer', example: 17},
            apiBookId: {type: 'string', example: 'OXf3o_EBrxYC'},
            title: {type: 'string', example: 'Clean Code'},
            authors: {type: 'array', items: {type: 'string'}},
            coverImageUrl: {type: 'string', nullable: true},
            readingProgress: {type: 'integer', example: 45},
            currentPage: {type: 'integer', nullable: true, example: 120},
            totalPages: {type: 'integer', nullable: true, example: 266},
            progressType: {type: 'string', enum: ['PAGE', 'PERCENTAGE'], nullable: true},
        },
    },
    WantToReadBook: {
        type: 'object',
        properties: {
            bookshelfBookId: {type: 'integer', example: 30},
            apiBookId: {type: 'string', example: 'zyTCAlFPjgYC'},
            title: {type: 'string', example: 'The Hobbit'},
            coverImageUrl: {type: 'string', nullable: true},
        },
    },
    Dashboard: {
        type: 'object',
        properties: {
            shelves: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer', example: 1},
                        name: {type: 'string', example: 'Read'},
                        type: {
                            type: 'string',
                            enum: ['READ', 'CURRENTLY_READING', 'TO_BE_READ'],
                        },
                        bookCount: {type: 'integer', example: 42},
                    },
                },
            },
            currentlyReading: {
                type: 'object',
                description: 'Up to 3 books, most recently updated first',
                properties: {
                    total: {type: 'integer', example: 4},
                    books: {
                        type: 'array',
                        items: {$ref: '#/components/schemas/ShelfBook'},
                    },
                },
            },
            wantToRead: {
                type: 'object',
                description: 'Up to 8 books, most recently added first',
                properties: {
                    total: {type: 'integer', example: 19},
                    books: {
                        type: 'array',
                        items: {$ref: '#/components/schemas/WantToReadBook'},
                    },
                },
            },
            readingChallenge: {
                type: 'object',
                description:
                    'Current UTC year; details at GET /api/readingChallenge/current',
                properties: {
                    year: {type: 'integer', example: 2026},
                    goal: {
                        type: 'integer',
                        nullable: true,
                        example: 30,
                        description: 'null when no goal was set for this year',
                    },
                    booksRead: {type: 'integer', example: 24},
                    booksThisMonth: {type: 'integer', example: 3},
                    progress: {$ref: '#/components/schemas/ReadingChallengeGoalProgress'},
                },
            },
        },
    },
};

export const dashboardPaths = {
    '/api/dashboard': {
        get: {
            tags: ['Dashboard'],
            summary:
                'Shelf counts, Currently Reading and Want to Read previews, and the current reading challenge',
            security: [{bearerAuth: []}],
            responses: {
                200: {
                    description: 'Everything the home dashboard shows',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Dashboard fetched successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            dashboard: {
                                                $ref: '#/components/schemas/Dashboard',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                401: {$ref: '#/components/responses/Unauthorized'},
            },
        },
    },
};
