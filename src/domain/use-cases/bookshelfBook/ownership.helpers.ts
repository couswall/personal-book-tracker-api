import {BookshelfBookEntity, BookshelfEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {ERROR_MESSAGES} from '@infrastructure/constants';

interface IOwnedBookshelfBook {
    bookshelfBook: BookshelfBookEntity;
    bookshelf: BookshelfEntity;
}

export const getOwnedBookshelf = async (
    bookshelfRepository: BookshelfRepository,
    bookshelfId: number,
    userId: number
): Promise<BookshelfEntity> => {
    const bookshelf = await bookshelfRepository.getBookshelfById(bookshelfId);

    if (bookshelf.userId !== userId)
        throw CustomError.badRequest(
            ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND
        );

    return bookshelf;
};

export const getOwnedBookshelfBook = async (
    bookshelfBookRepository: BookshelfBookRepository,
    bookshelfRepository: BookshelfRepository,
    bookshelfBookId: number,
    userId: number
): Promise<IOwnedBookshelfBook> => {
    const bookshelfBook =
        await bookshelfBookRepository.getBookshelfBookById(bookshelfBookId);
    const bookshelf = await bookshelfRepository.getBookshelfById(
        bookshelfBook.bookshelfId
    );

    if (bookshelf.userId !== userId)
        throw CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF_BOOK.NOT_FOUND);

    return {bookshelfBook, bookshelf};
};
