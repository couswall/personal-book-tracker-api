const yearParameter = {
    name: 'year',
    in: 'path',
    required: true,
    schema: {type: 'integer'},
    example: 2026,
};

const goalProperty = {
    type: 'integer',
    minimum: 1,
    maximum: 1000,
    example: 20,
    description: 'Number of books to read that year',
};

const challengeResponse = (description: string, message: string) => ({
    description,
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    success: {type: 'boolean', example: true},
                    message: {type: 'string', example: message},
                    data: {
                        type: 'object',
                        properties: {
                            readingChallenge: {
                                $ref: '#/components/schemas/ReadingChallengeResponse',
                            },
                        },
                    },
                },
            },
        },
    },
});

export const readingChallengePaths = {
    '/api/readingChallenge': {
        post: {
            tags: ['ReadingChallenge'],
            summary: 'Set a reading challenge (goal) for the current or next year',
            security: [{bearerAuth: []}],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['goal'],
                            properties: {
                                year: {
                                    type: 'integer',
                                    example: 2026,
                                    description:
                                        'Defaults to the current year. Only the current and next year are allowed.',
                                },
                                goal: goalProperty,
                            },
                        },
                    },
                },
            },
            responses: {
                201: challengeResponse(
                    'Reading challenge created',
                    'Reading challenge created successfully'
                ),
                400: {$ref: '#/components/responses/BadRequest'},
                401: {$ref: '#/components/responses/Unauthorized'},
            },
        },
    },
    '/api/readingChallenge/{year}': {
        patch: {
            tags: ['ReadingChallenge'],
            summary: "Change the goal of the current or next year's reading challenge",
            security: [{bearerAuth: []}],
            parameters: [yearParameter],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['goal'],
                            properties: {goal: goalProperty},
                        },
                    },
                },
            },
            responses: {
                200: challengeResponse(
                    'Reading challenge updated',
                    'Reading challenge updated successfully'
                ),
                400: {$ref: '#/components/responses/BadRequest'},
                401: {$ref: '#/components/responses/Unauthorized'},
                404: {$ref: '#/components/responses/NotFound'},
            },
        },
        delete: {
            tags: ['ReadingChallenge'],
            summary: 'Delete the reading challenge of a given year',
            security: [{bearerAuth: []}],
            parameters: [yearParameter],
            responses: {
                200: {
                    description: 'Reading challenge deleted',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {
                                        type: 'string',
                                        example: 'Reading challenge deleted successfully',
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
