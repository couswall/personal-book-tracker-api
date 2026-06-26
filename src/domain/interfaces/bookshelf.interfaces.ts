import {BookshelfType} from '@/generated/prisma';
import {BookshelfEntity, UserEntity} from '@domain/entities';

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
    readingProgress: number | null;
    currentPage: number | null;
}
