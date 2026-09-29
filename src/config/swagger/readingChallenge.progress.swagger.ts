const progressResponse = {
    description: 'Books read that year and, if a goal was set, progress towards it',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                properties: {
                    success: {type: 'boolean', example: true},
                    message: {
                        type: 'string',
                        example: 'Reading challenge progress fetched successfully',
                    },
                    data: {
                        type: 'object',
                        properties: {
                            readingChallenge: {
                                $ref: '#/components/schemas/ReadingChallengeProgress',
                            },
                        },
                    },
                },
            },
        },
    },
};

const errorResponses = {
    400: {$ref: '#/components/responses/BadRequest'},
    401: {$ref: '#/components/responses/Unauthorized'},
};

/** GET operations, merged into the path objects in readingChallenge.swagger.ts. */
export const readingChallengeProgressOperations = {
    history: {
        tags: ['ReadingChallenge'],
        summary:
            'List every reading challenge of the user (newest first) with its result',
        security: [{bearerAuth: []}],
        responses: {
            200: {
                description: 'Reading challenge history',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: {type: 'boolean', example: true},
                                message: {
                                    type: 'string',
                                    example:
                                        'Reading challenge history fetched successfully',
                                },
                                data: {
                                    type: 'object',
                                    properties: {
                                        readingChallenges: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/ReadingChallengeSummary',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            401: errorResponses[401],
        },
    },
    current: {
        tags: ['ReadingChallenge'],
        summary: 'Progress of the current (UTC) year',
        security: [{bearerAuth: []}],
        responses: {200: progressResponse, 401: errorResponses[401]},
    },
    byYear: {
        tags: ['ReadingChallenge'],
        summary: 'Progress of a given year',
        security: [{bearerAuth: []}],
        parameters: [
            {
                name: 'year',
                in: 'path',
                required: true,
                schema: {type: 'integer'},
                example: 2026,
            },
        ],
        responses: {200: progressResponse, ...errorResponses},
    },
};
