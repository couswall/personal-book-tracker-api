import {prisma} from '@data/postgres';
import {CustomError} from '@domain/errors/custom.error';
import {BookshelfEntity} from '@domain/entities';
import {BookshelfDatasource} from '@domain/datasources/bookshelf.datasource';
import {CreateCustomBookShelfDto} from '@domain/dtos/index';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';

export class BookshelfDatasourceImpl implements BookshelfDatasource {
    async createCustom(
        createBookShelfDto: CreateCustomBookShelfDto
    ): Promise<BookshelfEntity> {
        const {userId, shelfName} = createBookShelfDto;

        const existingBookshelf = await prisma.bookshelf.findFirst({
            where: {userId, name: shelfName, deletedAt: null},
        });

        if (existingBookshelf)
            throw CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.CREATE_CUSTOM.EXISTING);

        const customBookshelf = await prisma.bookshelf.create({
            data: {
                name: shelfName,
                type: 'CUSTOM',
                userId,
            },
        });

        return BookshelfEntity.fromObject(customBookshelf);
    }

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
                    select: {books: {where: {deletedAt: null}}},
                },
                books: book
                    ? {where: {bookId: book.id, deletedAt: null}, select: {id: true}}
                    : false,
            },
        });

        return bookshelves.map((shelf) => ({
            id: shelf.id,
            name: shelf.name,
            isSelected: book ? shelf.books.length > 0 : false,
            bookshelfBookId: book && shelf.books.length > 0 ? shelf.books[0].id : null,
            bookCount: shelf._count.books,
            isCustom: shelf.type === 'CUSTOM',
        }));
    }
}
