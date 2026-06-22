import {BookshelfBookEntity} from '@domain/entities';
import {AddToBookshelfDto} from '@domain/dtos/bookshelfBook/addToBookshelf-bookshelfBook.dto';
import {UpdateBookshelfDto} from '@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto';
import {RemoveFromBookshelfDto} from '@domain/dtos/bookshelfBook/removeFromBookshelf-bookshelfBook.dto';

export abstract class BookshelfBookRepository {
    abstract addToBookshelf(
        addToBookshelfDto: AddToBookshelfDto
    ): Promise<BookshelfBookEntity>;
    abstract updateBookshelf(
        updateBookshelfDto: UpdateBookshelfDto
    ): Promise<BookshelfBookEntity>;
    abstract removeFromBookshelf(
        removeFromBookshelfDto: RemoveFromBookshelfDto
    ): Promise<BookshelfBookEntity>;
}
