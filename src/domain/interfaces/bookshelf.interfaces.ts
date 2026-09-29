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
    /** Only on the READ shelf, when the book is on it: whether finishedAt's year has a reading challenge. */
    hasChallenge: boolean;
}

export interface IBookshelfCount {
    id: number;
    name: string;
    type: BookshelfType;
    bookCount: number;
}

/** A book on a shelf with what a list of that shelf needs to display it. */
export interface IShelfBook {
    bookshelfBookId: number;
    apiBookId: string;
    title: string;
    authors: string[];
    coverImageUrl: string | null;
    readingProgress: number;
    currentPage: number | null;
    totalPages: number | null;
    progressType: ReadingProgressType | null;
}
