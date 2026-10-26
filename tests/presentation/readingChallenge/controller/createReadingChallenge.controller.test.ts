import {Request, Response} from 'express';
import {Prisma} from '@/generated/prisma';
import {prisma} from '@tests/setup';
import {
    AUTH_USER_ID,
    CURRENT_YEAR,
    createReadingChallengeControllerSetup,
} from '@tests/presentation/readingChallenge/controller/setup';
import {readingChallengeObject} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {READING_CHALLENGE_DTO_ERRORS} from '@domain/constants/readingChallenge.constants';

describe('ReadingChallengeController.createReadingChallenge tests', () => {
    const {controller, mockRequest, mockResponse} =
        createReadingChallengeControllerSetup();

    // Handlers resolve their promise chain asynchronously, so wait a tick.
    const run = (handler: (req: Request, res: Response) => void) =>
        new Promise<void>((resolve) => {
            handler(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });
    const createdChallenge = {...readingChallengeObject, year: CURRENT_YEAR};

    beforeEach(() => {
        jest.clearAllMocks();
        mockResponse.locals = {userId: AUTH_USER_ID};
    });

    test('should return 201 and the challenge without its userId', async () => {
        mockRequest.body = {goal: 20};
        (prisma.readingChallenge.create as jest.Mock).mockResolvedValue(createdChallenge);

        await run(controller.createReadingChallenge);

        const {userId: _userId, ...expectedChallenge} = createdChallenge;
        expect(prisma.readingChallenge.create).toHaveBeenCalledWith({
            data: {userId: AUTH_USER_ID, year: CURRENT_YEAR, goal: 20},
        });
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Reading challenge created successfully',
            data: {readingChallenge: expectedChallenge},
        });
    });

    test('should return 400 when the goal is invalid', async () => {
        mockRequest.body = {goal: 0};

        await run(controller.createReadingChallenge);

        expect(prisma.readingChallenge.create).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: READING_CHALLENGE_DTO_ERRORS.GOAL.INVALID},
        });
    });

    test('should return 400 when the user already has a challenge that year', async () => {
        mockRequest.body = {goal: 20};
        (prisma.readingChallenge.create as jest.Mock).mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
                code: 'P2002',
                clientVersion: '0.0.0',
            })
        );

        await run(controller.createReadingChallenge);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: ERROR_MESSAGES.READING_CHALLENGE.ALREADY_EXISTS},
        });
    });

    test('should return 401 when there is no authenticated user', async () => {
        mockResponse.locals = {};
        mockRequest.body = {goal: 20};

        await run(controller.createReadingChallenge);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(prisma.readingChallenge.create).not.toHaveBeenCalled();
    });
});
