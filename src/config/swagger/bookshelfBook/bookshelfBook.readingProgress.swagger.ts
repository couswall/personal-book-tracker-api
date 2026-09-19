export const bookshelfBookReadingProgressPaths = {
    '/api/bookshelfBook/updateReadingProgress': {
        put: {
            tags: ['BookshelfBook'],
            summary: 'Update reading progress for a bookshelf book',
            security: [{bearerAuth: []}],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['bookshelfBookId', 'progressType', 'value'],
                            properties: {
                                bookshelfBookId: {type: 'integer', example: 5},
                                progressType: {
                                    type: 'string',
                                    enum: ['PAGE', 'PERCENTAGE'],
                                    example: 'PAGE',
                                },
                                value: {type: 'number', example: 150},
                                isFinished: {
                                    type: 'boolean',
                                    default: false,
                                    example: false,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Reading progress updated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Reading progress updated successfully',
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
};
