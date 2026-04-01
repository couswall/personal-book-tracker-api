import {prisma} from '@data/postgres';
import {BookshelfType} from '@prisma/client';
import {CustomError} from '@domain/errors/custom.error';
import {BookshelfBookEntity} from '@domain/entities';
import {AddToBookshelfDto} from '@domain/dtos/bookshelfBook/addToBookshelf-bookshelfBook.dto';
import {BookshelfBookDatasource} from '@domain/datasources/bookshelfbook.datasource';
import {UpdateBookshelfDto} from '@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto';
import {RemoveFromBookshelfDto} from '@domain/dtos/bookshelfBook/removeFromBookshelf-bookshelfBook.dto';
import {ERROR_MESSAGES} from '@infrastructure/constants';

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
            where: {bookshelfId, bookId: bookId},
        });

        if (existingBookshelfBook && !existingBookshelfBook.deletedAt)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.ADD_TO_BOOKSHELF.ALREADY_ADDED
            );

        const book = existingBookshelfBook
            ? await prisma.bookshelfBook.update({
                  where: {id: existingBookshelfBook.id},
                  data: {deletedAt: null, readingProgress, totalPages},
              })
            : await prisma.bookshelfBook.create({
                  data: {bookshelfId, bookId, readingProgress, totalPages},
              });

        return BookshelfBookEntity.fromObject(book);
    }

    async updateBookshelf(
        updateBookshelfDto: UpdateBookshelfDto
    ): Promise<BookshelfBookEntity> {
        const {bookshelfBookId, bookshelfId, bookshelfType = ''} = updateBookshelfDto;

        const existingBook = await prisma.bookshelfBook.findFirst({
            where: {id: bookshelfBookId, deletedAt: null},
        });

        if (!existingBook)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_BOOKSHELF.NOT_FOUND
            );

        if (existingBook.bookshelfId === bookshelfId)
            return BookshelfBookEntity.fromObject(existingBook);

        const updatedReadingProgress =
            bookshelfType === BookshelfType.READ ? 100 : existingBook.readingProgress;

        const softDeletedInTarget = await prisma.bookshelfBook.findFirst({
            where: {bookshelfId, bookId: existingBook.bookId, deletedAt: {not: null}},
        });

        if (softDeletedInTarget) {
            const [restored] = await prisma.$transaction([
                prisma.bookshelfBook.update({
                    where: {id: softDeletedInTarget.id},
                    data: {deletedAt: null, readingProgress: updatedReadingProgress},
                }),
                prisma.bookshelfBook.update({
                    where: {id: existingBook.id},
                    data: {deletedAt: new Date()},
                }),
            ]);
            return BookshelfBookEntity.fromObject(restored);
        }

        const updatedBook = await prisma.bookshelfBook.update({
            data: {bookshelfId, readingProgress: updatedReadingProgress},
            where: {id: existingBook.id},
        });

        return BookshelfBookEntity.fromObject(updatedBook);
    }

    async removeFromBookshelf(
        removeFromBookshelfDto: RemoveFromBookshelfDto
    ): Promise<BookshelfBookEntity> {
        const {bookshelfBookId} = removeFromBookshelfDto;

        const existingBook = await prisma.bookshelfBook.findUnique({
            where: {id: bookshelfBookId, deletedAt: null},
        });

        if (!existingBook)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.REMOVE_FROM_BOOKSHELF.NOT_FOUND
            );

        const deletedBook = await prisma.bookshelfBook.update({
            where: {id: bookshelfBookId},
            data: {deletedAt: new Date()},
        });

        return BookshelfBookEntity.fromObject(deletedBook);
    }
}
