import {prisma} from '@data/postgres';
import {Prisma, BookshelfType} from '@/generated/prisma';
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
            bookId,
            bookshelfType = BookshelfType.TO_BE_READ,
            totalPages = 0,
        } = addToBookshelfDto;

        if (!bookId) throw CustomError.internalServer('bookId is required');

        const readingProgress = bookshelfType === BookshelfType.READ ? 100 : 0;

        try {
            const book = await prisma.bookshelfBook.create({
                data: {bookshelfId, bookId, readingProgress, totalPages},
            });
            return BookshelfBookEntity.fromObject(book);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                throw CustomError.badRequest(
                    ERROR_MESSAGES.BOOKSHELF_BOOK.ADD_TO_BOOKSHELF.ALREADY_ADDED
                );
            }
            throw error;
        }
    }

    async updateBookshelf(
        updateBookshelfDto: UpdateBookshelfDto
    ): Promise<BookshelfBookEntity> {
        const {bookshelfBookId, bookshelfId, bookshelfType = ''} = updateBookshelfDto;

        const existingBook = await prisma.bookshelfBook.findFirst({
            where: {id: bookshelfBookId},
        });

        if (!existingBook)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_BOOKSHELF.NOT_FOUND
            );

        if (existingBook.bookshelfId === bookshelfId)
            return BookshelfBookEntity.fromObject(existingBook);

        const updatedReadingProgress =
            bookshelfType === BookshelfType.CURRENTLY_READING
                ? 0
                : bookshelfType === BookshelfType.READ
                  ? 100
                  : existingBook.readingProgress;

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
            where: {id: bookshelfBookId},
        });

        if (!existingBook)
            throw CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.REMOVE_FROM_BOOKSHELF.NOT_FOUND
            );

        const deletedBook = await prisma.bookshelfBook.delete({
            where: {id: bookshelfBookId},
        });

        return BookshelfBookEntity.fromObject(deletedBook);
    }
}
