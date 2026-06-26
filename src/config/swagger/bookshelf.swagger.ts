export const bookshelfPaths = {
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
