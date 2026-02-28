import {BookshelfType} from '@prisma/client';
import {BookshelfBookEntity} from '@domain/entities';
import {IUpdateBookshelfDto} from '@domain/interfaces/bookshelfBook.interfaces';

export const bookshelfBookObject = {
    id: 101,
    bookshelfId: 5,
    bookId: 202,
    readingProgress: 45,
    currentPage: 135,
    totalPages: 300,
    startReadingDate: new Date('2025-08-01'),
    endReadingDate: null,
    deletedAt: null,
};

export const bookshelfBookEntity = BookshelfBookEntity.fromObject(bookshelfBookObject);

export const addToBookshelfDtoObject = {
    bookshelfId: bookshelfBookObject.bookshelfId,
    apiBookId: 'apiBookId123',
};

export const updateBookshelfDtoObject: IUpdateBookshelfDto = {
    bookshelfBookId: 1,
    bookshelfId: 1,
    bookshelfType: BookshelfType.CUSTOM,
};

export const bookshelfBookPrisma = {...bookshelfBookObject};
