export const bookPaths = {
    '/api/book/search': {
        get: {
            tags: ['Book'],
            summary: 'Search books from the external API',
            security: [{bearerAuth: []}],
            parameters: [
                {
                    name: 'searchText',
                    in: 'query',
                    required: true,
                    schema: {type: 'string'},
                    example: 'Clean Code',
                },
                {
                    name: 'page',
                    in: 'query',
                    schema: {type: 'integer', minimum: 1},
                    example: 1,
                },
                {
                    name: 'printType',
                    in: 'query',
                    schema: {type: 'string', enum: ['all', 'books', 'magazines']},
                    example: 'books',
                },
                {
                    name: 'maxResults',
                    in: 'query',
                    schema: {type: 'integer', minimum: 1, maximum: 40},
                    example: 10,
                },
            ],
            responses: {
                200: {
                    description: 'Books search results',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Searching books successfully',
                                    },
                                    data: {
                                        type: 'array',
                                        items: {$ref: '#/components/schemas/BookSummary'},
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
    '/api/book/bookById/{bookId}': {
        get: {
            tags: ['Book'],
            summary: 'Get book details by external API book ID',
            security: [{bearerAuth: []}],
            parameters: [
                {
                    name: 'bookId',
                    in: 'path',
                    required: true,
                    schema: {type: 'string'},
                    example: 'OXf3o_EBrxYC',
                },
            ],
            responses: {
                200: {
                    description: 'Book details',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Getting book details successfully',
                                    },
                                    data: {$ref: '#/components/schemas/BookDetail'},
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
