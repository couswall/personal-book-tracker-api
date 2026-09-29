import {prisma} from '@tests/setup';
import {ReadingSessionEntity} from '@domain/entities';
import {ReadingSessionDatasourceImpl} from '@infrastructure/datasources/readingSession.datasource.impl';
import {
    createReadingSessionObject,
    finishSessionDates,
    readingSessionObject,
} from '@tests/fixtures';

describe('readingSession.datasource.impl session lifecycle', () => {
    const readingSessionDatasourceImpl = new ReadingSessionDatasourceImpl();
    const {id, userId, bookId} = readingSessionObject;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findOpenSession()', () => {
        test('should return a ReadingSessionEntity when an open session exists', async () => {
            (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue(
                readingSessionObject
            );

            const result = await readingSessionDatasourceImpl.findOpenSession(
                userId,
                bookId
            );

            expect(result).toBeInstanceOf(ReadingSessionEntity);
            expect(prisma.readingSession.findFirst).toHaveBeenCalledWith({
                where: {userId, bookId, finishedAt: null, deletedAt: null},
            });
        });

        test('should return null when no open session exists', async () => {
            (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await readingSessionDatasourceImpl.findOpenSession(
                userId,
                bookId
            );

            expect(result).toBeNull();
        });
    });

    describe('createSession()', () => {
        test('should return a ReadingSessionEntity when creation is successful', async () => {
            (prisma.readingSession.create as jest.Mock).mockResolvedValue(
                readingSessionObject
            );

            const result = await readingSessionDatasourceImpl.createSession(
                createReadingSessionObject
            );

            expect(result).toBeInstanceOf(ReadingSessionEntity);
            expect(prisma.readingSession.create).toHaveBeenCalledWith({
                data: createReadingSessionObject,
            });
        });
    });

    describe('finishSession()', () => {
        test('should update the session with the provided dates', async () => {
            const dates = {...finishSessionDates, startedAt: new Date('2026-03-01')};
            (prisma.readingSession.update as jest.Mock).mockResolvedValue({
                ...readingSessionObject,
                ...dates,
            });

            const result = await readingSessionDatasourceImpl.finishSession(id, dates);

            expect(result).toBeInstanceOf(ReadingSessionEntity);
            expect(result.finishedAt).toEqual(dates.finishedAt);
            expect(prisma.readingSession.update).toHaveBeenCalledWith({
                where: {id},
                data: dates,
            });
        });
    });

    describe('findLatestFinishedSession()', () => {
        test('should return the most recently finished, non-deleted session', async () => {
            (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue(
                readingSessionObject
            );

            const result = await readingSessionDatasourceImpl.findLatestFinishedSession(
                userId,
                bookId
            );

            expect(result).toBeInstanceOf(ReadingSessionEntity);
            expect(prisma.readingSession.findFirst).toHaveBeenCalledWith({
                where: {userId, bookId, finishedAt: {not: null}, deletedAt: null},
                orderBy: {finishedAt: 'desc'},
            });
        });

        test('should return null when the book has never been finished', async () => {
            (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await readingSessionDatasourceImpl.findLatestFinishedSession(
                userId,
                bookId
            );

            expect(result).toBeNull();
        });
    });

    describe('discardSession()', () => {
        test('should soft delete the session by setting deletedAt', async () => {
            (prisma.readingSession.update as jest.Mock).mockResolvedValue({
                ...readingSessionObject,
                deletedAt: new Date(),
            });

            const result = await readingSessionDatasourceImpl.discardSession(id);

            expect(result).toBeInstanceOf(ReadingSessionEntity);
            expect(result.deletedAt).toEqual(expect.any(Date));
            expect(prisma.readingSession.update).toHaveBeenCalledWith({
                where: {id},
                data: {deletedAt: expect.any(Date)},
            });
        });
    });
});
