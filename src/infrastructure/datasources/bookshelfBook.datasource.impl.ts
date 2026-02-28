import {prisma} from '@data/postgres';
import {BookshelfType} from '@prisma/client';
import {CustomError} from '@domain/errors/custom.error';
import {BookshelfBookEntity} from '@domain/entities';
import {AddToBookshelfDto} from '@domain/dtos/bookshelfBook/addToBookshelf-bookshelfBook.dto';
import {BookshelfBookDatasource} from '@domain/datasources/bookshelfbook.datasource';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {UpdateBookshelfDto} from '@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto';

export class BookshelfBookDatasourceImpl implements BookshelfBookDatasource {
    async addToBookshelf(
        addToBookshelfDto: AddToBookshelfDto
    ): Promise<BookshelfBookEntity> {
        const {
            bookshelfId,
            bookId = 0,
            bookshelfType = BookshelfType.TO_BE_READ,
            totalPages = 0,
        } = addToBookshelfDto;
        let readingProgress = bookshelfType === BookshelfType.READ ? 100 : 0;

        const existingBookshelfBook = await prisma.bookshelfBook.findFirst({
            where: {bookshelfId, bookId: bookId, deletedAt: null},
        });

        if (existingBookshelfBook)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.ADD_TO_BOOKSHELF.ALREADY_ADDED
            );

        const book = await prisma.bookshelfBook.create({
            data: {
                bookshelfId,
                bookId,
                readingProgress,
                totalPages,
            },
        });

        return BookshelfBookEntity.fromObject(book);
    }

    async updateBookshelf(
        updateBookshelfDto: UpdateBookshelfDto
    ): Promise<BookshelfBookEntity> {
        const {bookshelfBookId, bookshelfId, bookshelfType = ''} = updateBookshelfDto;

        const existingBook = await prisma.bookshelfBook.findUnique({
            where: {id: bookshelfBookId},
        });

        if (!existingBook)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_BOOKSHELF.NOT_FOUND
            );

        if (existingBook.bookshelfId === bookshelfId)
            return BookshelfBookEntity.fromObject(existingBook);

        const updatedReadingProgress =
            bookshelfType === BookshelfType.READ ? 100 : existingBook.readingProgress;

        const updatedBook = await prisma.bookshelfBook.update({
            data: {bookshelfId, readingProgress: updatedReadingProgress},
            where: {id: existingBook.id},
        });

        return BookshelfBookEntity.fromObject(updatedBook);
    }
}
