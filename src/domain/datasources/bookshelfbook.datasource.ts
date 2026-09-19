import {BookshelfBookEntity} from '@domain/entities';
import {AddToBookshelfDto} from '@domain/dtos/bookshelfBook/addToBookshelf-bookshelfBook.dto';
import {UpdateBookshelfDto} from '@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto';
import {RemoveFromBookshelfDto} from '@domain/dtos/bookshelfBook/removeFromBookshelf-bookshelfBook.dto';
import {UpdateReadingProgressDto} from '@domain/dtos/bookshelfBook/updateReadingProgress-bookshelfBook.dto';

export abstract class BookshelfBookDatasource {
    abstract addToBookshelf(
        addToBookshelfDto: AddToBookshelfDto
    ): Promise<BookshelfBookEntity>;
    abstract updateBookshelf(
        updateBookshelfDto: UpdateBookshelfDto
    ): Promise<BookshelfBookEntity>;
    abstract removeFromBookshelf(
        removeFromBookshelfDto: RemoveFromBookshelfDto
    ): Promise<BookshelfBookEntity>;
    abstract updateReadingProgress(
        updateReadingProgressDto: UpdateReadingProgressDto
    ): Promise<BookshelfBookEntity>;
    abstract getBookshelfBookById(bookshelfBookId: number): Promise<BookshelfBookEntity>;
    abstract finishReadingProgress(
        bookshelfBookId: number,
        readBookshelfId: number
    ): Promise<BookshelfBookEntity>;
}
