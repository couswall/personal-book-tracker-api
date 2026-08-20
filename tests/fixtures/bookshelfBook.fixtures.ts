import {BookshelfType} from '@/generated/prisma';
import {BookshelfBookEntity} from '@domain/entities';
import {
    IUpdateBookshelfDto,
    IRemoveFromBookshelfDto,
    IUpdateReadingProgressDto,
} from '@domain/interfaces/bookshelfBook.interfaces';

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
    bookshelfType: BookshelfType.TO_BE_READ,
};

export const removeFromBookshelfDtoObject: IRemoveFromBookshelfDto = {
    bookshelfBookId: bookshelfBookObject.id,
};

export const updateReadingProgressDtoObject: IUpdateReadingProgressDto = {
    bookshelfBookId: bookshelfBookObject.id,
    progressType: 'PAGE',
    value: 150,
    isFinished: false,
};

export const bookshelfBookPrisma = {...bookshelfBookObject};
