import {ReadingSessionRepositoryImpl} from '@infrastructure/repositories/readingSession.repository.impl';
import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {
    createReadingSessionObject,
    finishedReadingObject,
    finishSessionDates,
    readingSessionEntity,
    readingSessionObject,
    yearRange2026,
} from '@tests/fixtures';
import {ReadingSessionEntity} from '@domain/entities';

describe('readingSession.repository.impl tests', () => {
    const mockDatasource: jest.Mocked<ReadingSessionDatasource> = {
        findOpenSession: jest.fn(),
        createSession: jest.fn(),
        finishSession: jest.fn(),
        discardAllSessions: jest.fn(),
        discardSession: jest.fn(),
        getFinishedInRange: jest.fn(),
        countFinishedInRange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const repository = new ReadingSessionRepositoryImpl(mockDatasource);

    test('findOpenSession() should return a ReadingSessionEntity and call datasource.findOpenSession()', async () => {
        mockDatasource.findOpenSession.mockResolvedValue(readingSessionEntity);
        const result = await repository.findOpenSession(
            readingSessionObject.userId,
            readingSessionObject.bookId
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(mockDatasource.findOpenSession).toHaveBeenCalledWith(
            readingSessionObject.userId,
            readingSessionObject.bookId
        );
    });

    test('createSession should return a ReadingSessionEntity and call datasource.createSession()', async () => {
        mockDatasource.createSession.mockResolvedValue(readingSessionEntity);

        const result = await repository.createSession(createReadingSessionObject);

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(mockDatasource.createSession).toHaveBeenCalledWith(
            createReadingSessionObject
        );
    });

    test('finishSession should return a ReadingSessionEntity and call datasource.finishSession()', async () => {
        mockDatasource.finishSession.mockResolvedValue(readingSessionEntity);

        const result = await repository.finishSession(
            readingSessionObject.id,
            finishSessionDates
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(mockDatasource.finishSession).toHaveBeenCalledWith(
            readingSessionObject.id,
            finishSessionDates
        );
    });

    test('discardAllSessions should return the discarded count and call datasource.discardAllSessions()', async () => {
        mockDatasource.discardAllSessions.mockResolvedValue(2);

        const result = await repository.discardAllSessions(
            readingSessionObject.userId,
            readingSessionObject.bookId
        );

        expect(result).toBe(2);
        expect(mockDatasource.discardAllSessions).toHaveBeenCalledWith(
            readingSessionObject.userId,
            readingSessionObject.bookId
        );
    });

    test('discardSession should return a ReadingSessionEntity and call datasource.discardSession()', async () => {
        mockDatasource.discardSession.mockResolvedValue(readingSessionEntity);

        const result = await repository.discardSession(readingSessionObject.id);

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(mockDatasource.discardSession).toHaveBeenCalledWith(
            readingSessionObject.id
        );
    });

    test('getFinishedInRange should return finished readings and call datasource.getFinishedInRange()', async () => {
        mockDatasource.getFinishedInRange.mockResolvedValue([finishedReadingObject]);

        const result = await repository.getFinishedInRange(
            readingSessionObject.userId,
            yearRange2026
        );

        expect(result).toEqual([finishedReadingObject]);
        expect(mockDatasource.getFinishedInRange).toHaveBeenCalledWith(
            readingSessionObject.userId,
            yearRange2026
        );
    });

    test('countFinishedInRange should return the count and call datasource.countFinishedInRange()', async () => {
        mockDatasource.countFinishedInRange.mockResolvedValue(3);

        const result = await repository.countFinishedInRange(
            readingSessionObject.userId,
            yearRange2026
        );

        expect(result).toBe(3);
        expect(mockDatasource.countFinishedInRange).toHaveBeenCalledWith(
            readingSessionObject.userId,
            yearRange2026
        );
    });
});
