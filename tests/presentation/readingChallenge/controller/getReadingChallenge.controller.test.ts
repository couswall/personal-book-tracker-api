import {Request, Response} from 'express';
import {prisma} from '@tests/setup';
import {
    AUTH_USER_ID,
    CURRENT_YEAR,
    createReadingChallengeControllerSetup,
} from '@tests/presentation/readingChallenge/controller/setup';
import {finishedReadingObject, readingChallengeObject} from '@tests/fixtures';
import {READING_CHALLENGE_DTO_ERRORS} from '@domain/constants/readingChallenge.constants';

describe('ReadingChallengeController GET tests', () => {
    const {controller, mockRequest, mockResponse} =
        createReadingChallengeControllerSetup();

    // Handlers resolve their promise chain asynchronously, so wait a tick.
    const run = (handler: (req: Request, res: Response) => void) =>
        new Promise<void>((resolve) => {
            handler(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

    const {sessionId, bookId, title, coverImageUrl, finishedAt} = finishedReadingObject;
    const finishedSessionRow = {
        id: sessionId,
        bookId,
        finishedAt,
        book: {title, coverImageUrl},
    };
    const lastJsonBody = () => {
        const calls = (mockResponse.json as jest.Mock).mock.calls;
        return calls[calls.length - 1][0];
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockResponse.locals = {userId: AUTH_USER_ID};
        mockRequest.params = {year: '2026'};
        (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([
            finishedSessionRow,
        ]);
    });

    describe('getReadingChallengeProgress()', () => {
        test('should return 200 with the goal progress for that year', async () => {
            (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue(
                readingChallengeObject
            );

            await run(controller.getReadingChallengeProgress);

            expect(prisma.readingChallenge.findUnique).toHaveBeenCalledWith({
                where: {userId_year: {userId: AUTH_USER_ID, year: 2026}},
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(lastJsonBody()).toMatchObject({
                success: true,
                data: {
                    readingChallenge: {
                        year: 2026,
                        goal: readingChallengeObject.goal,
                        booksRead: 1,
                        books: [finishedReadingObject],
                        progress: {remaining: readingChallengeObject.goal - 1},
                    },
                },
            });
        });

        test('should return the books read with null goal and progress when no goal was set', async () => {
            (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue(null);

            await run(controller.getReadingChallengeProgress);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(lastJsonBody().data.readingChallenge).toMatchObject({
                goal: null,
                booksRead: 1,
                progress: null,
            });
        });

        test('should return 400 when the year is invalid', async () => {
            mockRequest.params = {year: 'abc'};

            await run(controller.getReadingChallengeProgress);

            expect(prisma.readingChallenge.findUnique).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: {message: READING_CHALLENGE_DTO_ERRORS.YEAR.INVALID},
            });
        });

        test('should return 401 when there is no authenticated user', async () => {
            mockResponse.locals = {};

            await run(controller.getReadingChallengeProgress);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(prisma.readingChallenge.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('getCurrentReadingChallengeProgress()', () => {
        test('should return the progress of the current UTC year', async () => {
            (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue(null);

            await run(controller.getCurrentReadingChallengeProgress);

            expect(prisma.readingChallenge.findUnique).toHaveBeenCalledWith({
                where: {userId_year: {userId: AUTH_USER_ID, year: CURRENT_YEAR}},
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(lastJsonBody().data.readingChallenge.year).toBe(CURRENT_YEAR);
        });
    });

    describe('getReadingChallengeHistory()', () => {
        test('should return 200 with a summary of every challenge', async () => {
            (prisma.readingChallenge.findMany as jest.Mock).mockResolvedValue([
                readingChallengeObject,
            ]);
            (prisma.readingSession.count as jest.Mock).mockResolvedValue(22);

            await run(controller.getReadingChallengeHistory);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Reading challenge history fetched successfully',
                data: {
                    readingChallenges: [
                        {
                            year: 2026,
                            goal: 20,
                            booksRead: 22,
                            percentage: 110,
                            completed: true,
                        },
                    ],
                },
            });
        });

        test('should return 401 when there is no authenticated user', async () => {
            mockResponse.locals = {};

            await run(controller.getReadingChallengeHistory);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(prisma.readingChallenge.findMany).not.toHaveBeenCalled();
        });
    });
});
