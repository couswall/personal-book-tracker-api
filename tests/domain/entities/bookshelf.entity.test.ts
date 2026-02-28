import {BookshelfType} from '@prisma/client';
import {BookshelfEntity} from '@domain/entities';
import {bookshelfObj} from '@tests/fixtures';

describe('bookshelf.entity tests', () => {
    test('should create a BookshelfEntity from valid properties', () => {
        const newBookshelfEntity = new BookshelfEntity(
            bookshelfObj.id,
            bookshelfObj.name,
            bookshelfObj.type,
            bookshelfObj.userId,
            bookshelfObj.books,
            bookshelfObj.deletedAt,
            bookshelfObj.user
        );

        expect(newBookshelfEntity).toBeInstanceOf(BookshelfEntity);
    });

    test('should set type property as CUSTOM when it is not provided', () => {
        const newBookshelfEntity = new BookshelfEntity(
            bookshelfObj.id,
            bookshelfObj.name,
            undefined,
            bookshelfObj.userId,
            bookshelfObj.books,
            bookshelfObj.deletedAt,
            bookshelfObj.user
        );

        expect(newBookshelfEntity).toBeInstanceOf(BookshelfEntity);
        expect(newBookshelfEntity.type).toBe(BookshelfType.CUSTOM);
    });

    test('should books property as an empty array when it is not provided', () => {
        const newBookshelfEntity = new BookshelfEntity(
            bookshelfObj.id,
            bookshelfObj.name,
            bookshelfObj.type,
            bookshelfObj.userId,
            undefined,
            bookshelfObj.deletedAt,
            bookshelfObj.user
        );

        expect(newBookshelfEntity).toBeInstanceOf(BookshelfEntity);
        expect(Array.isArray(newBookshelfEntity.books)).toBeTruthy();
        expect(newBookshelfEntity.books.length).toBe(0);
    });

    test('fromObject() should create a BookshelfEntity from valid object', () => {
        const newBookshelfEntity = BookshelfEntity.fromObject(bookshelfObj);

        expect(newBookshelfEntity).toBeInstanceOf(BookshelfEntity);
    });

    test('convertArray should create an array of Bookshelf entities from a valida array', () => {
        const result = BookshelfEntity.convertArray([bookshelfObj]);

        expect(result[0]).toBeInstanceOf(BookshelfEntity);
    });
});
