import {BookshelfEntity} from '@/src/domain/entities';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';

export class BookshelfRepositoryImpl implements BookshelfRepository {
    constructor(private readonly datasource: BookshelfDatasource) {}

    getMyBookshelves(userId: number): Promise<BookshelfEntity[]> {
        return this.datasource.getMyBookshelves(userId);
    }

    getBookshelfById(bookshelfId: number): Promise<BookshelfEntity> {
        return this.datasource.getBookshelfById(bookshelfId);
    }

    getBookshelvesWithStatus(
        userId: number,
        apiBookId: string
    ): Promise<IBookshelfWithStatus[]> {
        return this.datasource.getBookshelvesWithStatus(userId, apiBookId);
    }
}
