import {BookshelfType} from '@/generated/prisma';
import {BookshelfEntity} from '@domain/entities/index';
import {
    IBookshelfCount,
    IBookshelvesStatus,
    IShelfBook,
} from '@domain/interfaces/bookshelf.interfaces';

export abstract class BookshelfDatasource {
    abstract getMyBookshelves(userId: number): Promise<BookshelfEntity[]>;
    abstract getBookshelfById(bookshelfId: number): Promise<BookshelfEntity>;
    abstract getBookshelfByUserAndType(
        userId: number,
        type: BookshelfType
    ): Promise<BookshelfEntity>;
    abstract getBookshelvesWithStatus(
        userId: number,
        apiBookId: string
    ): Promise<IBookshelvesStatus>;
    abstract getBookshelfCounts(userId: number): Promise<IBookshelfCount[]>;
    abstract getShelfBooks(
        userId: number,
        type: BookshelfType,
        limit: number
    ): Promise<IShelfBook[]>;
}
