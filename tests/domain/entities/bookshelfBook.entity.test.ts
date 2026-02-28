import {BookshelfBookEntity} from '@domain/entities';
import {bookshelfBookObject} from '@tests/fixtures';
import {IBookshelfBookFromObject} from '@domain/interfaces/bookshelfBook.interfaces';

describe('BookshelfBookEntity', () => {
    describe('constructor', () => {
        test('should create a BookshelfBookEntity from valid properties', () => {
            const bookshelfBookEntity = new BookshelfBookEntity(
                bookshelfBookObject.id,
                bookshelfBookObject.bookshelfId,
                bookshelfBookObject.bookId,
                bookshelfBookObject.readingProgress,
                bookshelfBookObject.currentPage,
                bookshelfBookObject.totalPages,
                bookshelfBookObject.startReadingDate,
                bookshelfBookObject.endReadingDate,
                bookshelfBookObject.deletedAt
            );

            expect(bookshelfBookEntity).toBeInstanceOf(BookshelfBookEntity);
            expect(bookshelfBookEntity.id).toBe(bookshelfBookObject.id);
            expect(bookshelfBookEntity.bookshelfId).toBe(bookshelfBookObject.bookshelfId);
            expect(bookshelfBookEntity.bookId).toBe(bookshelfBookObject.bookId);
            expect(bookshelfBookEntity.readingProgress).toBe(
                bookshelfBookObject.readingProgress
            );
            expect(bookshelfBookEntity.currentPage).toBe(bookshelfBookObject.currentPage);
            expect(bookshelfBookEntity.totalPages).toBe(bookshelfBookObject.totalPages);
            expect(bookshelfBookEntity.startReadingDate).toBe(
                bookshelfBookObject.startReadingDate
            );
            expect(bookshelfBookEntity.endReadingDate).toBe(
                bookshelfBookObject.endReadingDate
            );
            expect(bookshelfBookEntity.deletedAt).toBe(bookshelfBookObject.deletedAt);
        });

        test('should use default readingProgress value when not provided', () => {
            const bookshelfBookEntity = new BookshelfBookEntity(
                bookshelfBookObject.id,
                bookshelfBookObject.bookshelfId,
                bookshelfBookObject.bookId,
                undefined,
                bookshelfBookObject.currentPage,
                bookshelfBookObject.totalPages,
                bookshelfBookObject.startReadingDate,
                bookshelfBookObject.endReadingDate,
                bookshelfBookObject.deletedAt
            );

            expect(bookshelfBookEntity.readingProgress).toBe(0);
        });

        test('should handle null values correctly', () => {
            const nullValuesEntity = new BookshelfBookEntity(
                1,
                2,
                3,
                0,
                null,
                null,
                null,
                null,
                null
            );

            expect(nullValuesEntity.currentPage).toBeNull();
            expect(nullValuesEntity.totalPages).toBeNull();
            expect(nullValuesEntity.startReadingDate).toBeNull();
            expect(nullValuesEntity.endReadingDate).toBeNull();
            expect(nullValuesEntity.deletedAt).toBeNull();
        });
    });

    describe('fromObject static method', () => {
        test('should create entity from object with all properties', () => {
            const entity = BookshelfBookEntity.fromObject(bookshelfBookObject);

            expect(entity).toBeInstanceOf(BookshelfBookEntity);
            expect(entity.id).toBe(bookshelfBookObject.id);
            expect(entity.bookshelfId).toBe(bookshelfBookObject.bookshelfId);
            expect(entity.bookId).toBe(bookshelfBookObject.bookId);
            expect(entity.readingProgress).toBe(bookshelfBookObject.readingProgress);
            expect(entity.currentPage).toBe(bookshelfBookObject.currentPage);
            expect(entity.totalPages).toBe(bookshelfBookObject.totalPages);
            expect(entity.startReadingDate).toBe(bookshelfBookObject.startReadingDate);
            expect(entity.endReadingDate).toBe(bookshelfBookObject.endReadingDate);
            expect(entity.deletedAt).toBe(bookshelfBookObject.deletedAt);
        });

        test('should create entity from object with partial null values', () => {
            const partialObject = {
                ...bookshelfBookObject,
                readingProgress: 0,
                currentPage: null,
                totalPages: null,
                startReadingDate: null,
                endReadingDate: null,
                deletedAt: null,
            };

            const entity = BookshelfBookEntity.fromObject(partialObject);

            expect(entity).toBeInstanceOf(BookshelfBookEntity);
            expect(entity.currentPage).toBeNull();
            expect(entity.totalPages).toBeNull();
            expect(entity.startReadingDate).toBeNull();
            expect(entity.endReadingDate).toBeNull();
            expect(entity.deletedAt).toBeNull();
        });

        test('should use default readingProgress when not provided in object', () => {
            const objectWithoutProgress = {
                ...bookshelfBookObject,
                readingProgress: undefined,
            } as unknown as IBookshelfBookFromObject;

            const entity = BookshelfBookEntity.fromObject(objectWithoutProgress);

            expect(entity.readingProgress).toBe(0);
        });
    });

    describe('edge cases', () => {
        test('should handle zero values correctly', () => {
            const zeroValuesEntity = new BookshelfBookEntity(
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null,
                null
            );

            expect(zeroValuesEntity.id).toBe(0);
            expect(zeroValuesEntity.bookshelfId).toBe(0);
            expect(zeroValuesEntity.bookId).toBe(0);
            expect(zeroValuesEntity.readingProgress).toBe(0);
            expect(zeroValuesEntity.currentPage).toBe(0);
            expect(zeroValuesEntity.totalPages).toBe(0);
        });

        test('should handle maximum values correctly', () => {
            const maxValuesEntity = new BookshelfBookEntity(
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                100,
                Number.MAX_SAFE_INTEGER,
                Number.MAX_SAFE_INTEGER,
                new Date('9999-12-31'),
                new Date('9999-12-31'),
                new Date('9999-12-31')
            );

            expect(maxValuesEntity.id).toBe(Number.MAX_SAFE_INTEGER);
            expect(maxValuesEntity.readingProgress).toBe(100);
        });
    });
});
