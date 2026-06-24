import {BookshelfEntity} from '@domain/entities/index';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';

export abstract class BookshelfRepository {
    abstract getMyBookshelves(userId: number): Promise<BookshelfEntity[]>;
    abstract getBookshelfById(bookshelfId: number): Promise<BookshelfEntity>;
    abstract getBookshelvesWithStatus(
        userId: number,
        apiBookId: string
    ): Promise<IBookshelfWithStatus[]>;
}
