export const authPaths = {
    '/api/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Login with email/username and password',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['emailOrUsername', 'password'],
                            properties: {
                                emailOrUsername: {type: 'string', example: 'john_doe'},
                                password: {type: 'string', example: 'Password1!'},
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Login successful',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Login successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            user: {
                                                $ref: '#/components/schemas/UserResponse',
                                            },
                                            token: {type: 'string'},
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
    '/api/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Register a new user',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['fullName', 'username', 'email', 'password'],
                            properties: {
                                fullName: {type: 'string', example: 'John Doe'},
                                username: {type: 'string', example: 'john_doe'},
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    example: 'john@example.com',
                                },
                                password: {type: 'string', example: 'Password1!'},
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'User created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'User created successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            user: {
                                                $ref: '#/components/schemas/UserResponse',
                                            },
                                            token: {type: 'string'},
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                400: {$ref: '#/components/responses/BadRequest'},
            },
        },
    },
    '/api/auth/refresh': {
        post: {
            tags: ['Auth'],
            summary: 'Refresh JWT token',
            security: [{bearerAuth: []}],
            responses: {
                200: {
                    description: 'Token refreshed successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Token refreshed successfully',
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            user: {
                                                $ref: '#/components/schemas/UserResponse',
                                            },
                                            token: {type: 'string'},
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
