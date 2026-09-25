import {BookshelfType} from '@/generated/prisma';
import {BookshelfEntity, UserEntity} from '@domain/entities';
import {ReadingProgressType} from '@domain/interfaces/bookshelfBook.interfaces';

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
    type: BookshelfType;
    isSelected: boolean;
    bookshelfBookId: number | null;
    bookCount: number;
    readingProgress: number | null;
    currentPage: number | null;
    progressType: ReadingProgressType | null;
    /** Only on the READ shelf, when the book is on it: its latest finish date (null = unknown). */
    finishedAt: Date | null;
}
