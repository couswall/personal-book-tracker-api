import { BookEntity } from "@domain/entities/book.entity";
import { bookObj } from "@tests/fixtures";

describe('book.entity tests', () => {
    test('should create a BookEntity from valid properties', () => {
        const newBookEntity = new BookEntity(
            bookObj.id,
            bookObj.apiBookId,
            bookObj.title,
            bookObj.authors,
            bookObj.description,
            bookObj.publishedDate,
            bookObj.coverImageUrl,
            bookObj.categories,
            bookObj.pageCount,
            bookObj.averageRating,
            bookObj.reviewCount,
            bookObj.subtitle,
            [],
            [],
            [],
            bookObj.deletedAt,
        );
        
        expect(newBookEntity).toBeInstanceOf(BookEntity);
        expect(newBookEntity.id).toBe(bookObj.id);
        expect(newBookEntity.apiBookId).toBe(bookObj.apiBookId);
    });
    test('should set subtitle property as null when it is not provided', () => {
         const newBookEntity = new BookEntity(
            bookObj.id,
            bookObj.apiBookId,
            bookObj.title,
            bookObj.authors,
            bookObj.description,
            bookObj.publishedDate,
            bookObj.coverImageUrl,
            bookObj.categories,
            bookObj.pageCount,
            bookObj.averageRating,
            bookObj.reviewCount,
        );
        
        expect(newBookEntity).toBeInstanceOf(BookEntity);
        expect(newBookEntity.subtitle).toBeNull();
    });
    test('should set deletedAt property as null when it is not provided', () => {
         const newBookEntity = new BookEntity(
            bookObj.id,
            bookObj.apiBookId,
            bookObj.title,
            bookObj.authors,
            bookObj.description,
            bookObj.publishedDate,
            bookObj.coverImageUrl,
            bookObj.categories,
            bookObj.pageCount,
            bookObj.averageRating,
            bookObj.reviewCount,
            bookObj.subtitle,
            [],
            [],
            [],
        );
        
        expect(newBookEntity).toBeInstanceOf(BookEntity);
        expect(newBookEntity.deletedAt).toBeNull();
    });
    test('should set averageRating and reviewCount properties as zero when they are not provided', () => {
         const newBookEntity = new BookEntity(
            bookObj.id,
            bookObj.apiBookId,
            bookObj.title,
            bookObj.authors,
            bookObj.description,
            bookObj.publishedDate,
            bookObj.coverImageUrl,
            bookObj.categories,
            bookObj.pageCount,
            undefined,
            undefined,
        );
        
        expect(newBookEntity).toBeInstanceOf(BookEntity);
        expect(newBookEntity.averageRating).toBe(0);
    });
    test('should set bookshelves, reviews and notes as empty arrays if they are not provided', () => {
         const newBookEntity = new BookEntity(
            bookObj.id,
            bookObj.apiBookId,
            bookObj.title,
            bookObj.authors,
            bookObj.description,
            bookObj.publishedDate,
            bookObj.coverImageUrl,
            bookObj.categories,
            bookObj.pageCount,
            bookObj.averageRating,
            bookObj.reviewCount,
            bookObj.subtitle,
        );
        
        expect(newBookEntity).toBeInstanceOf(BookEntity);
        expect(Array.isArray(newBookEntity.bookshelves)).toBeTruthy();
        expect(newBookEntity.bookshelves.length).toBe(0);
        expect(Array.isArray(newBookEntity.reviews)).toBeTruthy();
        expect(newBookEntity.reviews.length).toBe(0);
        expect(Array.isArray(newBookEntity.notes)).toBeTruthy();
        expect(newBookEntity.notes.length).toBe(0);
    });

    describe('fromObject()', () => {
        test('should create a BookEntity from a valid object', () => {
            const newBookEntity = BookEntity.fromObject(bookObj);

            expect(newBookEntity).toBeInstanceOf(BookEntity);
            expect(newBookEntity.id).toBe(bookObj.id);
            expect(newBookEntity.apiBookId).toBe(bookObj.apiBookId);
        });
        test('should set averageRating property as zero if it is null', () => {
            const newBookEntity = BookEntity.fromObject({...bookObj, averageRating: null});

            expect(newBookEntity).toBeInstanceOf(BookEntity);
            expect(newBookEntity.averageRating).toBe(0);
        });
        test('should set bookshelves, reviews and notes properties as empty arrays if they are not provided', () => {
            const bookObject = {...bookObj, bookshelves: undefined, reviews: undefined, notes: undefined};
            const newBookEntity = BookEntity.fromObject(bookObject);

            expect(newBookEntity).toBeInstanceOf(BookEntity);
            expect(Array.isArray(newBookEntity.bookshelves)).toBeTruthy();
            expect(newBookEntity.bookshelves.length).toBe(0);
            expect(Array.isArray(newBookEntity.reviews)).toBeTruthy();
            expect(newBookEntity.reviews.length).toBe(0);
            expect(Array.isArray(newBookEntity.notes)).toBeTruthy();
            expect(newBookEntity.notes.length).toBe(0);
        });
    });
});