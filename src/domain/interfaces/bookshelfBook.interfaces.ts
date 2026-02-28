export interface IAddToBookshelfDto{
    bookshelfId? : number | string;
    apiBookId?: string;
    bookId?: number;
    totalPages?: number | null;
    bookshelfType?: string;
}

export interface IBookshelfBookFromObject{
    id: number;
    bookshelfId: number;
    bookId: number;
    readingProgress: number;
    currentPage: number | null;
    totalPages: number | null;
    startReadingDate: Date | null;
    endReadingDate: Date | null;
    deletedAt: Date | null;
}

export interface IUpdateBookshelfDto{
    bookshelfBookId?: number | string;
    bookshelfId? : number | string;
    bookshelfType?: string;
}