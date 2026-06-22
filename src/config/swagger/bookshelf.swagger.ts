export const bookshelfPaths = {
    '/api/bookshelf/createCustom': {
        post: {
            tags: ['Bookshelf'],
            summary: 'Create a custom bookshelf',
            security: [{bearerAuth: []}],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['userId', 'shelfName'],
                            properties: {
                                userId: {type: 'integer', example: 1},
                                shelfName: {
                                    type: 'string',
                                    minLength: 2,
                                    maxLength: 90,
                                    example: 'Favorites',
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Custom bookshelf created',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Custom bookshelf created successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            id: {type: 'integer'},
                                            name: {type: 'string'},
                                            type: {type: 'string'},
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
    '/api/bookshelf/getMyBookshelves/{userId}': {
        get: {
            tags: ['Bookshelf'],
            summary: "Get all of a user's bookshelves",
            security: [{bearerAuth: []}],
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: {type: 'integer'},
                    example: 1,
                },
            ],
            responses: {
                200: {
                    description: 'List of bookshelves',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Successfully fetched bookshelves.',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/BookshelfResponse',
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
    '/api/bookshelf/bookStatus/{userId}/{apiBookId}': {
        get: {
            tags: ['Bookshelf'],
            summary: 'Get bookshelves with membership status for a specific book',
            security: [{bearerAuth: []}],
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: {type: 'integer'},
                    example: 1,
                },
                {
                    name: 'apiBookId',
                    in: 'path',
                    required: true,
                    schema: {type: 'string'},
                    example: 'OXf3o_EBrxYC',
                },
            ],
            responses: {
                200: {
                    description: 'Bookshelves with book status',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example:
                                            'Bookshelves with book status fetched successfully.',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            bookshelves: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/BookshelfWithStatus',
                                                },
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
};
