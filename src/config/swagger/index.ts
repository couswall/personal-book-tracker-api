import {authPaths} from '@config/swagger/auth.swagger';
import {bookPaths} from '@config/swagger/book.swagger';
import {bookshelfPaths} from '@config/swagger/bookshelf.swagger';
import {bookshelfBookPaths} from '@config/swagger/bookshelfBook/bookshelfBook.swagger';
import {bookshelfBookReadingProgressPaths} from '@config/swagger/bookshelfBook/bookshelfBook.readingProgress.swagger';
import {swaggerSchemas} from '@config/swagger/schemas.swagger';
import {readingChallengePaths} from '@config/swagger/readingChallenge.swagger';

export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Personal Book Tracker API',
        version: '1.0.0',
        description:
            'REST API for managing personal bookshelves and tracking reading progress.',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        responses: {
            BadRequest: {
                description: 'Invalid request data',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: {type: 'boolean', example: false},
                                error: {
                                    type: 'object',
                                    properties: {message: {type: 'string'}},
                                },
                            },
                        },
                    },
                },
            },
            Unauthorized: {
                description: 'Missing or invalid JWT token',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: {type: 'boolean', example: false},
                                error: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Invalid token',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            NotFound: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: {type: 'boolean', example: false},
                                error: {
                                    type: 'object',
                                    properties: {
                                        message: {type: 'string', example: 'Not found'},
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        schemas: swaggerSchemas,
    },
    paths: {
        ...authPaths,
        ...bookPaths,
        ...bookshelfPaths,
        ...bookshelfBookPaths,
        ...bookshelfBookReadingProgressPaths,
        ...readingChallengePaths,
    },
};
