import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {ICreateReadingSession} from '@domain/interfaces/readingSession.interfaces';
import {ReadingSessionEntity} from '@domain/entities';
import {createReadingSessionObject, readingSessionEntity} from '@tests/fixtures';

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
    }

    const mockReadingSessionDatasource = new MockReadingSessionDatasource();

    test('abstract class should include all its methods', async () => {
        expect(mockReadingSessionDatasource).toBeInstanceOf(MockReadingSessionDatasource);
        expect(typeof mockReadingSessionDatasource.findOpenSession).toBe('function');
        expect(typeof mockReadingSessionDatasource.createSession).toBe('function');
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
});
