import {authPaths} from '@config/swagger/auth.swagger';
import {bookPaths} from '@config/swagger/book.swagger';
import {bookshelfPaths} from '@config/swagger/bookshelf.swagger';
import {bookshelfBookPaths} from '@config/swagger/bookshelfBook/bookshelfBook.swagger';
import {bookshelfBookReadingProgressPaths} from '@config/swagger/bookshelfBook/bookshelfBook.readingProgress.swagger';

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
        schemas: {
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
        },
    },
    paths: {
        ...authPaths,
        ...bookPaths,
        ...bookshelfPaths,
        ...bookshelfBookPaths,
        ...bookshelfBookReadingProgressPaths,
    },
};
