import { IBookshelfBookFromObject } from "@domain/interfaces/bookshelfBook.interfaces";

export class BookshelfBookEntity{
    constructor(
        public id: number,
        public bookshelfId: number,
        public bookId: number,
        public readingProgress: number = 0,
        public currentPage: number | null,
        public totalPages: number | null,
        public startReadingDate: Date | null,
        public endReadingDate: Date | null,
        public deletedAt: Date | null,
    ){};

    static fromObject(object: IBookshelfBookFromObject): BookshelfBookEntity{
        return new BookshelfBookEntity(
            object.id, 
            object.bookshelfId, 
            object.bookId, 
            object.readingProgress,
            object.currentPage,
            object.totalPages,
            object.startReadingDate,
            object.endReadingDate,
            object.deletedAt,
        );
    }
}