export interface IAddToBookshelfDto {
    bookshelfId?: number | string;
    apiBookId?: string;
    bookId?: number;
    totalPages?: number | null;
    bookshelfType?: string;
    finishedAt?: string | null;
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
    finishedAt?: string | null;
    discardLastRead?: boolean;
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
    finishedAt?: string | null;
}

/** Progress fields of a bookshelf book, as stored. */
export interface IShelfBookProgress {
    readingProgress: number;
    currentPage: number | null;
    progressType: ReadingProgressType | null;
}

/** Progress fields as exposed per bookshelf; null when not on Currently Reading. */
export interface IShelfReadingProgress {
    readingProgress: number | null;
    currentPage: number | null;
    progressType: ReadingProgressType | null;
}

export interface IParsedFinish {
    isFinished: boolean;
    finishedAt?: Date | null;
}
