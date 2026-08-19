import {ReadingSessionRepositoryImpl} from '@infrastructure/repositories/readingSession.repository.impl';
import {ReadingSessionDatasource} from '@domain/datasources/readingSession.datasource';
import {
    createReadingSessionObject,
    readingSessionEntity,
    readingSessionObject,
} from '@tests/fixtures';
import {ReadingSessionEntity} from '@domain/entities';

describe('readingSession.repository.impl tests', () => {
    const mockDatasource: jest.Mocked<ReadingSessionDatasource> = {
        findOpenSession: jest.fn(),
        createSession: jest.fn(),
        finishSession: jest.fn(),
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

        const result = await repository.finishSession(readingSessionObject.id);

        expect(result).toBeInstanceOf(ReadingSessionEntity);
        expect(mockDatasource.finishSession).toHaveBeenCalledWith(
            readingSessionObject.id
        );
    });
});
