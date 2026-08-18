import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {ICreateReadingSession} from '@domain/interfaces/readingSession.interfaces';
import {ReadingSessionEntity} from '@domain/entities';
import {createReadingSessionObject, readingSessionEntity} from '@tests/fixtures';

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
    }

    const mockReadingSessionRepository = new MockReadingSessionRepository();

    test('abstract class should include all its methods', async () => {
        expect(mockReadingSessionRepository).toBeInstanceOf(MockReadingSessionRepository);
        expect(typeof mockReadingSessionRepository.findOpenSession).toBe('function');
        expect(typeof mockReadingSessionRepository.createSession).toBe('function');
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
});
