import {Request, Response} from 'express';
import {prisma, createMockRequest, createMockResponse} from '@tests/setup';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {BookshelfRepositoryImpl} from '@infrastructure/repositories/bookshelf.repository.impl';
import {ReadingChallengeDatasourceImpl} from '@infrastructure/datasources/readingChallenge.datasource.impl';
import {ReadingChallengeRepositoryImpl} from '@infrastructure/repositories/readingChallenge.repository.impl';
import {ReadingSessionDatasourceImpl} from '@infrastructure/datasources/readingSession.datasource.impl';
import {ReadingSessionRepositoryImpl} from '@infrastructure/repositories/readingSession.repository.impl';
import {DashboardController} from '@presentation/dashboard/controller';
import {bookshelfCount, readingChallengeObject} from '@tests/fixtures';

describe('DashboardController.getDashboard', () => {
    const controller = new DashboardController(
        new BookshelfRepositoryImpl(new BookshelfDatasourceImpl()),
        new ReadingChallengeRepositoryImpl(new ReadingChallengeDatasourceImpl()),
        new ReadingSessionRepositoryImpl(new ReadingSessionDatasourceImpl())
    );
    const mockRequest = createMockRequest();
    const mockResponse = createMockResponse();
    const AUTH_USER_ID = readingChallengeObject.userId;

    // The handler resolves its promise chain asynchronously, so wait a tick.
    const run = () =>
        new Promise<void>((resolve) => {
            controller.getDashboard(mockRequest as Request, mockResponse as Response);
            setImmediate(resolve);
        });

    beforeEach(() => {
        jest.clearAllMocks();
        mockResponse.locals = {userId: AUTH_USER_ID};
        const {id, name, type, bookCount} = bookshelfCount;
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            {id, name, type, _count: {books: bookCount}},
        ]);
        (prisma.bookshelfBook.findMany as jest.Mock).mockResolvedValue([]);
        (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([]);
    });

    test('should return 200 with the dashboard data', async () => {
        await run();

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            message: 'Dashboard fetched successfully',
            data: {
                dashboard: {
                    shelves: [bookshelfCount],
                    currentlyReading: {total: 0, books: []},
                    wantToRead: {total: bookshelfCount.bookCount, books: []},
                    readingChallenge: {
                        year: new Date().getUTCFullYear(),
                        goal: null,
                        booksRead: 0,
                        booksThisMonth: 0,
                        progress: null,
                    },
                },
            },
        });
    });

    test('should return 401 when there is no authenticated user', async () => {
        mockResponse.locals = {};

        await run();

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(prisma.bookshelf.findMany).not.toHaveBeenCalled();
    });

    test('should return 500 when a query fails', async () => {
        (prisma.bookshelf.findMany as jest.Mock).mockRejectedValue(new Error('DB down'));

        await run();

        expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
});
