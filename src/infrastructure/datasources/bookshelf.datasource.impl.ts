import {prisma} from '@data/postgres';
import {BookshelfType} from '@/generated/prisma';
import {CustomError} from '@domain/errors/custom.error';
import {BookshelfEntity} from '@domain/entities';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';

export class BookshelfDatasourceImpl implements BookshelfDatasource {
    async getMyBookshelves(userId: number): Promise<BookshelfEntity[]> {
        const bookshelves = await prisma.bookshelf.findMany({
            where: {userId, deletedAt: null},
        });

        return BookshelfEntity.convertArray(bookshelves);
    }

    async getBookshelfById(bookshelfId: number): Promise<BookshelfEntity> {
        const bookshelf = await prisma.bookshelf.findUnique({
            where: {id: bookshelfId, deletedAt: null},
        });

        if (!bookshelf)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND
            );

        return BookshelfEntity.fromObject(bookshelf);
    }

    async getBookshelvesWithStatus(
        userId: number,
        apiBookId: string
    ): Promise<IBookshelfWithStatus[]> {
        const book = await prisma.book.findUnique({
            where: {apiBookId},
            select: {id: true},
        });

        const bookshelves = await prisma.bookshelf.findMany({
            where: {userId, deletedAt: null},
            include: {
                _count: {
                    select: {books: true},
                },
                books: book
                    ? {
                          where: {bookId: book.id},
                          select: {id: true, readingProgress: true, currentPage: true},
                      }
                    : false,
            },
        });

        return bookshelves.map((shelf) => {
            const bookExists = book && shelf.books.length > 0;
            const isCurrentlyReading = shelf.type === BookshelfType.CURRENTLY_READING;
            return {
                id: shelf.id,
                name: shelf.name,
                isSelected: book ? shelf.books.length > 0 : false,
                bookshelfBookId: bookExists ? shelf.books[0].id : null,
                bookCount: shelf._count.books,
                readingProgress:
                    bookExists && isCurrentlyReading
                        ? shelf.books[0].readingProgress
                        : null,
                currentPage:
                    bookExists && isCurrentlyReading ? shelf.books[0].currentPage : null,
            };
        });
    }
}
