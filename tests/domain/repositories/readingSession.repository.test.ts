import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
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

describe('readingSession.repository tests', () => {
    class MockReadingSessionRepository implements ReadingSessionRepository {
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
        async discardAllSessions(_userId: number, _bookId: number): Promise<number> {
            return 1;
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

    const mockReadingSessionRepository = new MockReadingSessionRepository();

    test('abstract class should include all its methods', async () => {
        expect(mockReadingSessionRepository).toBeInstanceOf(MockReadingSessionRepository);
        expect(typeof mockReadingSessionRepository.findOpenSession).toBe('function');
        expect(typeof mockReadingSessionRepository.createSession).toBe('function');
        expect(typeof mockReadingSessionRepository.finishSession).toBe('function');
        expect(typeof mockReadingSessionRepository.discardAllSessions).toBe('function');
        expect(typeof mockReadingSessionRepository.discardSession).toBe('function');
        expect(typeof mockReadingSessionRepository.getFinishedInRange).toBe('function');
        expect(typeof mockReadingSessionRepository.countFinishedInRange).toBe('function');
    });

    test('getFinishedInRange() should return an array of finished readings', async () => {
        const result = await mockReadingSessionRepository.getFinishedInRange(
            readingSessionEntity.userId,
            yearRange2026
        );

        expect(result).toEqual([finishedReadingObject]);
    });

    test('countFinishedInRange() should return a number', async () => {
        const result = await mockReadingSessionRepository.countFinishedInRange(
            readingSessionEntity.userId,
            yearRange2026
        );

        expect(result).toBe(1);
    });

    test('findOpenSession() should return a ReadingSessionEntity', async () => {
        const result = await mockReadingSessionRepository.findOpenSession(
            readingSessionEntity.userId,
            readingSessionEntity.bookId
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(result).toEqual(readingSessionEntity);
    });

    test('createSession() should return a ReadingSessionEntity', async () => {
        const result = await mockReadingSessionRepository.createSession(
            createReadingSessionObject
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(result).toEqual(readingSessionEntity);
    });

    test('finishSession() should return a ReadingSessionEntity', async () => {
        const result = await mockReadingSessionRepository.finishSession(
            readingSessionEntity.id,
            finishSessionDates
        );

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(result).toEqual(readingSessionEntity);
    });
});
