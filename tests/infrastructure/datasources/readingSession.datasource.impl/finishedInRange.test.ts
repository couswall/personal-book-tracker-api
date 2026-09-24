import {prisma} from '@tests/setup';
import {ReadingSessionDatasourceImpl} from '@infrastructure/datasources/readingSession.datasource.impl';
import {finishedReadingObject, yearRange2026} from '@tests/fixtures';

describe('readingSession.datasource.impl finished-in-range queries', () => {
    const readingSessionDatasourceImpl = new ReadingSessionDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getFinishedInRange()', () => {
        const {sessionId, bookId, title, coverImageUrl, finishedAt} =
            finishedReadingObject;
        const finishedSessionRow = {
            id: sessionId,
            bookId,
            finishedAt,
            book: {title, coverImageUrl},
        };

        test('should map finished sessions to IFinishedReading objects', async () => {
            (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([
                finishedSessionRow,
            ]);

            const result = await readingSessionDatasourceImpl.getFinishedInRange(
                1,
                yearRange2026
            );

            expect(result).toEqual([finishedReadingObject]);
        });

        test('should query non-deleted sessions finished within the range, ordered by finishedAt', async () => {
            (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([]);

            await readingSessionDatasourceImpl.getFinishedInRange(1, yearRange2026);

            expect(prisma.readingSession.findMany).toHaveBeenCalledWith({
                where: {
                    userId: 1,
                    deletedAt: null,
                    finishedAt: {gte: yearRange2026.from, lt: yearRange2026.to},
                },
                select: {
                    id: true,
                    bookId: true,
                    finishedAt: true,
                    book: {select: {title: true, coverImageUrl: true}},
                },
                orderBy: {finishedAt: 'asc'},
            });
        });

        test('should return an empty array when no sessions were finished in the range', async () => {
            (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([]);

            const result = await readingSessionDatasourceImpl.getFinishedInRange(
                1,
                yearRange2026
            );

            expect(result).toEqual([]);
        });

        test('should skip rows whose finishedAt is null', async () => {
            (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([
                finishedSessionRow,
                {...finishedSessionRow, id: 2, finishedAt: null},
            ]);

            const result = await readingSessionDatasourceImpl.getFinishedInRange(
                1,
                yearRange2026
            );

            expect(result).toEqual([finishedReadingObject]);
        });
    });

    describe('countFinishedInRange()', () => {
        test('should return the number of sessions finished within the range', async () => {
            (prisma.readingSession.count as jest.Mock).mockResolvedValue(7);

            const result = await readingSessionDatasourceImpl.countFinishedInRange(
                1,
                yearRange2026
            );

            expect(result).toBe(7);
            expect(prisma.readingSession.count).toHaveBeenCalledWith({
                where: {
                    userId: 1,
                    deletedAt: null,
                    finishedAt: {gte: yearRange2026.from, lt: yearRange2026.to},
                },
            });
        });
    });
});
