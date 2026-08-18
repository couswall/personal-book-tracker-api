import {prisma} from '@tests/setup';
import {ReadingSessionEntity} from '@domain/entities';
import {ReadingSessionDatasourceImpl} from '@infrastructure/datasources/readingSession.datasource.impl';
import {createReadingSessionObject, readingSessionObject} from '@tests/fixtures';

describe('readingSession.datasource.impl tests', () => {
    const readingSessionDatasourceImpl = new ReadingSessionDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findOpenSession()', () => {
        test('should return a ReadingSessionEntity when an open session exists', async () => {
            const {userId, bookId} = readingSessionObject;

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
            const {userId, bookId} = readingSessionObject;

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
});
