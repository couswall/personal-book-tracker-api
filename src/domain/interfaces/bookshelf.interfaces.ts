import {BookshelfType} from '@prisma/client';
import {BookshelfEntity, UserEntity} from '@domain/entities';

export interface ICreateCustomBookShelfDto {
    userId?: number;
    shelfName?: string;
}

export interface ICreateBookshelfEntity {
    id: number;
    name: string;
    type: BookshelfType;
    userId: number;
    deletedAt: Date | null;
    books?: BookshelfEntity[];
    user?: UserEntity;
}

export interface IBookshelfWithStatus {
    id: number;
    name: string;
    isSelected: boolean;
    bookshelfBookId: number | null;
    bookCount: number;
    isCustom: boolean;
}
