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
