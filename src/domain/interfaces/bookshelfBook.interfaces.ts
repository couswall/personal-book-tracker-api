export interface IAddToBookshelfDto {
    bookshelfId?: number | string;
    apiBookId?: string;
    bookId?: number;
    totalPages?: number | null;
    bookshelfType?: string;
}

export interface IBookshelfBookFromObject {
    id: number;
    bookshelfId: number;
    bookId: number;
    readingProgress: number;
    currentPage: number | null;
    totalPages: number | null;
    progressType: ReadingProgressType | null;
}

export interface IUpdateBookshelfDto {
    bookshelfBookId?: number | string;
    bookshelfId?: number | string;
    bookshelfType?: string;
}

export interface IRemoveFromBookshelfDto {
    bookshelfBookId?: number | string;
}

export type ReadingProgressType = 'PAGE' | 'PERCENTAGE';

export interface IUpdateReadingProgressDto {
    bookshelfBookId?: number | string;
    progressType?: string;
    value?: number | string;
    isFinished?: boolean;
}
