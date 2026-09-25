import {BookshelfType} from '@/generated/prisma';
import {BookshelfEntity} from '@/src/domain/entities';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {
    IBookshelfCount,
    IBookshelfWithStatus,
    IShelfBook,
} from '@domain/interfaces/bookshelf.interfaces';

export class BookshelfRepositoryImpl implements BookshelfRepository {
    constructor(private readonly datasource: BookshelfDatasource) {}

    getMyBookshelves(userId: number): Promise<BookshelfEntity[]> {
        return this.datasource.getMyBookshelves(userId);
    }

    getBookshelfById(bookshelfId: number): Promise<BookshelfEntity> {
        return this.datasource.getBookshelfById(bookshelfId);
    }

    getBookshelfByUserAndType(
        userId: number,
        type: BookshelfType
    ): Promise<BookshelfEntity> {
        return this.datasource.getBookshelfByUserAndType(userId, type);
    }

    getBookshelvesWithStatus(
        userId: number,
        apiBookId: string
    ): Promise<IBookshelfWithStatus[]> {
        return this.datasource.getBookshelvesWithStatus(userId, apiBookId);
    }

    getBookshelfCounts(userId: number): Promise<IBookshelfCount[]> {
        return this.datasource.getBookshelfCounts(userId);
    }

    getShelfBooks(
        userId: number,
        type: BookshelfType,
        limit: number
    ): Promise<IShelfBook[]> {
        return this.datasource.getShelfBooks(userId, type, limit);
    }
}
