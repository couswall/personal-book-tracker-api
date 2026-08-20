import {BookshelfType} from '@/generated/prisma';
import {BookshelfEntity} from '@domain/entities';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';
import {userEntity} from 'tests/fixtures/user.fixtures';

export const bookshelfObj = {
    id: 1,
    name: 'Testing bookshelf',
    type: BookshelfType.TO_BE_READ,
    userId: 1,
    deletedAt: null,
    books: [],
    user: userEntity,
};

export const bookshelfEntity = BookshelfEntity.fromObject(bookshelfObj);

export const bookshelfPrisma = {...bookshelfObj};

export const readBookshelfObj = {
    ...bookshelfObj,
    id: 2,
    name: 'Read',
    type: BookshelfType.READ,
};

export const readBookshelfEntity = BookshelfEntity.fromObject(readBookshelfObj);

export const readBookshelfPrisma = {...readBookshelfObj};

export const bookshelfWithStatus: IBookshelfWithStatus = {
    id: bookshelfObj.id,
    name: bookshelfObj.name,
    isSelected: true,
    bookshelfBookId: 101,
    bookCount: 3,
    readingProgress: null,
    currentPage: null,
};
