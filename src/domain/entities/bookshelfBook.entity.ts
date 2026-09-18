import {
    IBookshelfBookFromObject,
    ReadingProgressType,
} from '@domain/interfaces/bookshelfBook.interfaces';

export class BookshelfBookEntity {
    constructor(
        public id: number,
        public bookshelfId: number,
        public bookId: number,
        public readingProgress: number = 0,
        public currentPage: number | null,
        public totalPages: number | null,
        public progressType: ReadingProgressType | null = null
    ) {}

    static fromObject(object: IBookshelfBookFromObject): BookshelfBookEntity {
        return new BookshelfBookEntity(
            object.id,
            object.bookshelfId,
            object.bookId,
            object.readingProgress,
            object.currentPage,
            object.totalPages,
            object.progressType
        );
    }
}
