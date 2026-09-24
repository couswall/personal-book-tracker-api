import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {
    ICreateReadingSession,
    IDateRange,
    IFinishedReading,
    IFinishSessionDates,
} from '@domain/interfaces/readingSession.interfaces';
import {ReadingSessionEntity} from '@domain/entities';
import {
    createReadingSessionObject,
    finishedReadingObject,
    finishSessionDates,
    readingSessionEntity,
    yearRange2026,
} from '@tests/fixtures';

describe('readingSession.datasource tests', () => {
    class MockReadingSessionDatasource implements ReadingSessionDatasource {
        async findOpenSession(
            _userId: number,
            _bookId: number
        ): Promise<ReadingSessionEntity | null> {
            return readingSessionEntity;
        }
        async createSession(_data: ICreateReadingSession): Promise<ReadingSessionEntity> {
            return readingSessionEntity;
        }
        async finishSession(
            _sessionId: number,
            _dates: IFinishSessionDates
        ): Promise<ReadingSessionEntity> {
            return readingSessionEntity;
        }
        async findLatestFinishedSession(
            _userId: number,
            _bookId: number
        ): Promise<ReadingSessionEntity | null> {
            return readingSessionEntity;
        }
        async discardSession(_sessionId: number): Promise<ReadingSessionEntity> {
            return readingSessionEntity;
        }
        async getFinishedInRange(
            _userId: number,
            _range: IDateRange
        ): Promise<IFinishedReading[]> {
            return [finishedReadingObject];
        }
        async countFinishedInRange(_userId: number, _range: IDateRange): Promise<number> {
            return 1;
        }
    }

    const mockReadingSessionDatasource = new MockReadingSessionDatasource();

    test('abstract class should include all its methods', async () => {
        expect(mockReadingSessionDatasource).toBeInstanceOf(MockReadingSessionDatasource);
        expect(typeof mockReadingSessionDatasource.findOpenSession).toBe('function');
        expect(typeof mockReadingSessionDatasource.createSession).toBe('function');
        expect(typeof mockReadingSessionDatasource.finishSession).toBe('function');
        expect(typeof mockReadingSessionDatasource.findLatestFinishedSession).toBe(
            'function'
        );
        expect(typeof mockReadingSessionDatasource.discardSession).toBe('function');
        expect(typeof mockReadingSessionDatasource.getFinishedInRange).toBe('function');
        expect(typeof mockReadingSessionDatasource.countFinishedInRange).toBe('function');
    });

    test('getFinishedInRange() should return an array of finished readings', async () => {
        const result = await mockReadingSessionDatasource.getFinishedInRange(
            readingSessionEntity.userId,
            yearRange2026
        );

        expect(result).toEqual([finishedReadingObject]);
    });

    test('countFinishedInRange() should return a number', async () => {
        const result = await mockReadingSessionDatasource.countFinishedInRange(
            readingSessionEntity.userId,
            yearRange2026
        );

        expect(result).toBe(1);
    });

    test('findOpenSession() should return a ReadingSessionEntity', async () => {
        const result = await mockReadingSessionDatasource.findOpenSession(
            readingSessionEntity.userId,
            readingSessionEntity.bookId
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(result).toEqual(readingSessionEntity);
    });

    test('createSession() should return a ReadingSessionEntity', async () => {
        const result = await mockReadingSessionDatasource.createSession(
            createReadingSessionObject
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(result).toEqual(readingSessionEntity);
    });

    test('finishSession() should return a ReadingSessionEntity', async () => {
        const result = await mockReadingSessionDatasource.finishSession(
            readingSessionEntity.id,
            finishSessionDates
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(result).toEqual(readingSessionEntity);
    });
});
