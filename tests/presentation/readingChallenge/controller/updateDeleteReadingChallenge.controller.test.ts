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

const recordNotFound = () =>
    new Prisma.PrismaClientKnownRequestError('Record not found', {
        code: 'P2025',
        clientVersion: '0.0.0',
    });

describe('ReadingChallengeController update/delete tests', () => {
    const {controller, mockRequest, mockResponse} =
        createReadingChallengeControllerSetup();

    // Handlers resolve their promise chain asynchronously, so wait a tick.
    const run = (handler: (req: Request, res: Response) => void) =>
        new Promise<void>((resolve) => {
            handler(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });
    const where = {userId_year: {userId: AUTH_USER_ID, year: CURRENT_YEAR}};
    const notFoundBody = {
        success: false,
        error: {message: ERROR_MESSAGES.READING_CHALLENGE.NOT_FOUND},
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest.params = {year: String(CURRENT_YEAR)};
        mockRequest.body = {};
    });

    describe('updateReadingChallenge()', () => {
        test('should return 200 after changing the goal', async () => {
            mockRequest.body = {goal: 35};
            (prisma.readingChallenge.update as jest.Mock).mockResolvedValue({
                ...readingChallengeObject,
                year: CURRENT_YEAR,
                goal: 35,
            });

            await run(controller.updateReadingChallenge);

            expect(prisma.readingChallenge.update).toHaveBeenCalledWith({
                where,
                data: {goal: 35},
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: {readingChallenge: expect.objectContaining({goal: 35})},
                })
            );
        });

        test('should return 400 when trying to change a past challenge', async () => {
            mockRequest.params = {year: String(CURRENT_YEAR - 1)};
            mockRequest.body = {goal: 35};

            await run(controller.updateReadingChallenge);

            expect(prisma.readingChallenge.update).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: READING_CHALLENGE_DTO_ERRORS.YEAR.NOT_EDITABLE},
            });
        });

        test('should return 404 when the user has no challenge that year', async () => {
            mockRequest.body = {goal: 35};
            (prisma.readingChallenge.update as jest.Mock).mockRejectedValue(
                recordNotFound()
            );

            await run(controller.updateReadingChallenge);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(notFoundBody);
        });
    });

    describe('deleteReadingChallenge()', () => {
        test('should return 200 after deleting the challenge', async () => {
            (prisma.readingChallenge.delete as jest.Mock).mockResolvedValue(
                readingChallengeObject
            );

            await run(controller.deleteReadingChallenge);

            expect(prisma.readingChallenge.delete).toHaveBeenCalledWith({where});
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Reading challenge deleted successfully',
            });
        });

        test('should return 400 when the year param is invalid', async () => {
            mockRequest.params = {year: 'abc'};

            await run(controller.deleteReadingChallenge);

            expect(prisma.readingChallenge.delete).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

        test('should return 404 when the user has no challenge that year', async () => {
            (prisma.readingChallenge.delete as jest.Mock).mockRejectedValue(
                recordNotFound()
            );

            await run(controller.deleteReadingChallenge);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(notFoundBody);
        });
    });
});
