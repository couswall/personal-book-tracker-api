import {prisma} from '@data/postgres';
import {BookshelfType} from '@/generated/prisma';
import {CustomError} from '@domain/errors/custom.error';
import {BookshelfEntity} from '@domain/entities';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {
    IBookshelfCount,
    IBookshelfWithStatus,
    IShelfBook,
} from '@domain/interfaces/bookshelf.interfaces';
import {toReadingProgress} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.progress.helpers';

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

    async getBookshelfByUserAndType(
        userId: number,
        type: BookshelfType
    ): Promise<BookshelfEntity> {
        const bookshelf = await prisma.bookshelf.findFirst({
            where: {userId, type, deletedAt: null},
        });

        if (!bookshelf)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_USER_AND_TYPE.NOT_FOUND
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

        const [bookshelves, latestFinishedAt] = await Promise.all([
            prisma.bookshelf.findMany({
                where: {userId, deletedAt: null},
                include: {
                    _count: {
                        select: {books: true},
                    },
                    books: book
                        ? {
                              where: {bookId: book.id},
                              select: {
                                  id: true,
                                  readingProgress: true,
                                  currentPage: true,
                                  progressType: true,
                              },
                          }
                        : false,
                },
            }),
            book ? this.findLatestFinishedAt(userId, book.id) : null,
        ]);

        return bookshelves.map((shelf) => {
            // `books` is only included (and holds at most this book) when the book exists
            const shelfBook = book ? shelf.books[0] : undefined;
            const isOnReadShelf = Boolean(shelfBook) && shelf.type === BookshelfType.READ;
            return {
                id: shelf.id,
                name: shelf.name,
                type: shelf.type,
                isSelected: Boolean(shelfBook),
                bookshelfBookId: shelfBook ? shelfBook.id : null,
                bookCount: shelf._count.books,
                ...toReadingProgress(
                    shelf.type === BookshelfType.CURRENTLY_READING ? shelfBook : undefined
                ),
                finishedAt: isOnReadShelf ? latestFinishedAt : null,
            };
        });
    }

    async getBookshelfCounts(userId: number): Promise<IBookshelfCount[]> {
        const bookshelves = await prisma.bookshelf.findMany({
            where: {userId, deletedAt: null},
            orderBy: {id: 'asc'},
            select: {
                id: true,
                name: true,
                type: true,
                _count: {select: {books: true}},
            },
        });

        return bookshelves.map(({_count, ...shelf}) => ({
            ...shelf,
            bookCount: _count.books,
        }));
    }

    async getShelfBooks(
        userId: number,
        type: BookshelfType,
        limit: number
    ): Promise<IShelfBook[]> {
        const shelfBooks = await prisma.bookshelfBook.findMany({
            where: {bookshelf: {userId, type, deletedAt: null}},
            // id breaks ties between rows that predate the updatedAt column
            orderBy: [{updatedAt: 'desc'}, {id: 'desc'}],
            take: limit,
            include: {
                book: {
                    select: {
                        apiBookId: true,
                        title: true,
                        authors: true,
                        coverImageUrl: true,
                    },
                },
            },
        });

        return shelfBooks.map(({book, ...shelfBook}) => ({
            bookshelfBookId: shelfBook.id,
            ...book,
            readingProgress: shelfBook.readingProgress,
            currentPage: shelfBook.currentPage,
            totalPages: shelfBook.totalPages,
            progressType: shelfBook.progressType,
        }));
    }

    /** When the book was last finished; lets clients tell which year's challenge it counts toward. */
    private async findLatestFinishedAt(
        userId: number,
        bookId: number
    ): Promise<Date | null> {
        const session = await prisma.readingSession.findFirst({
            where: {userId, bookId, finishedAt: {not: null}, deletedAt: null},
            orderBy: {finishedAt: 'desc'},
            select: {finishedAt: true},
        });
        return session?.finishedAt ?? null;
    }
}
