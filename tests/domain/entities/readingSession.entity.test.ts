import {ReadingSessionEntity} from '@domain/entities';
import {readingSessionObject} from '@tests/fixtures';

describe('ReadingSessionEntity', () => {
    describe('constructor', () => {
        test('should create a ReadingSessionEntity from valid properties', () => {
            const readingSessionEntity = new ReadingSessionEntity(
                readingSessionObject.id,
                readingSessionObject.userId,
                readingSessionObject.bookId,
                readingSessionObject.startedAt,
                readingSessionObject.finishedAt,
                readingSessionObject.createdAt,
                readingSessionObject.deletedAt
            );

            expect(readingSessionEntity).toBeInstanceOf(ReadingSessionEntity);
            expect(readingSessionEntity.id).toBe(readingSessionObject.id);
            expect(readingSessionEntity.userId).toBe(readingSessionObject.userId);
            expect(readingSessionEntity.bookId).toBe(readingSessionObject.bookId);
            expect(readingSessionEntity.startedAt).toBe(readingSessionObject.startedAt);
            expect(readingSessionEntity.finishedAt).toBe(readingSessionObject.finishedAt);
            expect(readingSessionEntity.createdAt).toBe(readingSessionObject.createdAt);
            expect(readingSessionEntity.deletedAt).toBe(readingSessionObject.deletedAt);
        });

        test('should handle null values correctly', () => {
            const startedAt = new Date('2024-01-01T10:00:00.000Z');
            const createdAt = new Date('2024-01-01T10:00:00.000Z');

            const nullValuesEntity = new ReadingSessionEntity(
                1,
                2,
                3,
                startedAt,
                null,
                createdAt,
                null
            );

            expect(nullValuesEntity.finishedAt).toBeNull();
            expect(nullValuesEntity.deletedAt).toBeNull();
        });

        test('should represent an active session when finishedAt is null', () => {
            const startedAt = new Date('2024-01-01T10:00:00.000Z');
            const createdAt = new Date('2024-01-01T10:00:00.000Z');

            const activeSessionEntity = new ReadingSessionEntity(
                1,
                1,
                1,
                startedAt,
                null,
                createdAt,
                null
            );

            expect(activeSessionEntity.finishedAt).toBeNull();
            expect(activeSessionEntity.startedAt).toBe(startedAt);
        });
    });

    describe('fromObject static method', () => {
        test('should create entity from object with all properties', () => {
            const entity = ReadingSessionEntity.fromObject(readingSessionObject);

            expect(entity).toBeInstanceOf(ReadingSessionEntity);
            expect(entity.id).toBe(readingSessionObject.id);
            expect(entity.userId).toBe(readingSessionObject.userId);
            expect(entity.bookId).toBe(readingSessionObject.bookId);
            expect(entity.startedAt).toBe(readingSessionObject.startedAt);
            expect(entity.finishedAt).toBe(readingSessionObject.finishedAt);
            expect(entity.createdAt).toBe(readingSessionObject.createdAt);
            expect(entity.deletedAt).toBe(readingSessionObject.deletedAt);
        });

        test('should create entity from object with partial null values', () => {
            const startedAt = new Date('2024-01-01T10:00:00.000Z');
            const createdAt = new Date('2024-01-01T10:00:00.000Z');

            const partialObject = {
                ...readingSessionObject,
                startedAt,
                finishedAt: null,
                createdAt,
                deletedAt: null,
            };

            const entity = ReadingSessionEntity.fromObject(partialObject);

            expect(entity).toBeInstanceOf(ReadingSessionEntity);
            expect(entity.finishedAt).toBeNull();
            expect(entity.deletedAt).toBeNull();
            expect(entity.startedAt).toBe(startedAt);
            expect(entity.createdAt).toBe(createdAt);
        });
    });

    describe('edge cases', () => {
        test('should handle zero values correctly', () => {
            const startedAt = new Date('2024-01-01T00:00:00.000Z');
            const createdAt = new Date('2024-01-01T00:00:00.000Z');

            const zeroValuesEntity = new ReadingSessionEntity(
                0,
                0,
                0,
                startedAt,
                null,
                createdAt,
                null
            );

            expect(zeroValuesEntity.id).toBe(0);
            expect(zeroValuesEntity.userId).toBe(0);
            expect(zeroValuesEntity.bookId).toBe(0);
            expect(zeroValuesEntity.finishedAt).toBeNull();
            expect(zeroValuesEntity.deletedAt).toBeNull();
        });

        test('should handle maximum values correctly', () => {
            const startedAt = new Date('2024-01-01T00:00:00.000Z');
            const finishedAt = new Date('2024-01-01T12:00:00.000Z');
            const createdAt = new Date('2024-01-01T00:00:00.000Z');

            const maxValuesEntity = new ReadingSessionEntity(
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                startedAt,
                finishedAt,
                createdAt,
                null
            );

            expect(maxValuesEntity.id).toBe(Number.MAX_SAFE_INTEGER);
            expect(maxValuesEntity.userId).toBe(Number.MAX_SAFE_INTEGER);
            expect(maxValuesEntity.bookId).toBe(Number.MAX_SAFE_INTEGER);
            expect(maxValuesEntity.finishedAt).toBe(finishedAt);
        });
    });
});
