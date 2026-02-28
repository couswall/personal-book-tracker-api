import {BookshelfType} from '@prisma/client';
import {BookshelfEntity} from '@domain/entities';
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

export const createCustomBookshelfDto = {
    userId: bookshelfObj.id,
    shelfName: 'Custom bookshelf',
};

export const bookshelfPrisma = {...bookshelfObj};
