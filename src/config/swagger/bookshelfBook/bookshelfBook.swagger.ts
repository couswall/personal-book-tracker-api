export const bookshelfBookPaths = {
    '/api/bookshelfBook/addToBookshelf': {
        post: {
            tags: ['BookshelfBook'],
            summary: 'Add a book to a bookshelf',
            security: [{bearerAuth: []}],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['bookshelfId', 'apiBookId'],
                            properties: {
                                bookshelfId: {type: 'integer', example: 1},
                                apiBookId: {type: 'string', example: 'OXf3o_EBrxYC'},
                                bookId: {type: 'integer', example: 42},
                                totalPages: {
                                    type: 'integer',
                                    nullable: true,
                                    example: 320,
                                },
                                bookshelfType: {type: 'string', example: 'READING'},
                                finishedAt: {
                                    type: 'string',
                                    format: 'date',
                                    nullable: true,
                                    example: '2026-03-15',
                                    description:
                                        'READ shelf only. The read counts toward that year; omitted or null means the date is unknown and nothing is counted.',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Book added to bookshelf',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Bookshelf Book added to bookshelf',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            bookshelfBook: {
                                                $ref: '#/components/schemas/BookshelfBookResponse',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {$ref: '#/components/responses/BadRequest'},
                401: {$ref: '#/components/responses/Unauthorized'},
            },
        },
    },
    '/api/bookshelfBook/updateBookshelf': {
        put: {
            tags: ['BookshelfBook'],
            summary: 'Move a bookshelf book to a different bookshelf',
            security: [{bearerAuth: []}],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['bookshelfBookId', 'bookshelfId'],
                            properties: {
                                bookshelfBookId: {type: 'integer', example: 5},
                                bookshelfId: {type: 'integer', example: 2},
                                bookshelfType: {type: 'string', example: 'READ'},
                                finishedAt: {
                                    type: 'string',
                                    format: 'date',
                                    nullable: true,
                                    example: '2026-03-15',
                                    description:
                                        'When moving to READ. From CURRENTLY_READING, omitted means finished now. From TO_BE_READ, a finish is only recorded when a date is sent. null means the date is unknown and nothing is counted. Moves never delete past finishes; moving CURRENTLY_READING → TO_BE_READ drops the in-progress read.',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Bookshelf book updated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Bookshelf book updated successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            bookshelfBook: {
                                                $ref: '#/components/schemas/BookshelfBookResponse',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {$ref: '#/components/responses/BadRequest'},
                401: {$ref: '#/components/responses/Unauthorized'},
            },
        },
    },
    '/api/bookshelfBook/{bookshelfBookId}': {
        delete: {
            tags: ['BookshelfBook'],
            summary: 'Remove a book from a bookshelf',
            security: [{bearerAuth: []}],
            parameters: [
                {
                    name: 'bookshelfBookId',
                    in: 'path',
                    required: true,
                    schema: {type: 'integer'},
                    example: 5,
                },
            ],
            responses: {
                200: {
                    description: 'Book removed from bookshelf',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example:
                                            'Book removed from bookshelf successfully',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {$ref: '#/components/responses/BadRequest'},
                401: {$ref: '#/components/responses/Unauthorized'},
                404: {$ref: '#/components/responses/NotFound'},
            },
        },
    },
};
