import {BookshelfBookEntity} from '@domain/entities';
import {BookshelfBookDatasource} from '@domain/datasources/bookshelfbook.datasource';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {AddToBookshelfDto} from '@domain/dtos/bookshelfBook/addToBookshelf-bookshelfBook.dto';
import {UpdateBookshelfDto} from '@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto';
import {RemoveFromBookshelfDto} from '@domain/dtos/bookshelfBook/removeFromBookshelf-bookshelfBook.dto';
import {UpdateReadingProgressDto} from '@domain/dtos/bookshelfBook/updateReadingProgress-bookshelfBook.dto';

export class BookshelfBookRepositoryImpl implements BookshelfBookRepository {
    constructor(private readonly datasource: BookshelfBookDatasource) {}

    addToBookshelf(addToBookshelfDto: AddToBookshelfDto): Promise<BookshelfBookEntity> {
        return this.datasource.addToBookshelf(addToBookshelfDto);
    }

    updateBookshelf(
        updateBookshelfDto: UpdateBookshelfDto
    ): Promise<BookshelfBookEntity> {
        return this.datasource.updateBookshelf(updateBookshelfDto);
    }

    removeFromBookshelf(
        removeFromBookshelfDto: RemoveFromBookshelfDto
    ): Promise<BookshelfBookEntity> {
        return this.datasource.removeFromBookshelf(removeFromBookshelfDto);
    }

    updateReadingProgress(
        updateReadingProgressDto: UpdateReadingProgressDto
    ): Promise<BookshelfBookEntity> {
        return this.datasource.updateReadingProgress(updateReadingProgressDto);
    }

    getBookshelfBookById(bookshelfBookId: number): Promise<BookshelfBookEntity> {
        return this.datasource.getBookshelfBookById(bookshelfBookId);
    }

    finishReadingProgress(
        bookshelfBookId: number,
        readBookshelfId: number
    ): Promise<BookshelfBookEntity> {
        return this.datasource.finishReadingProgress(bookshelfBookId, readBookshelfId);
    }
}
