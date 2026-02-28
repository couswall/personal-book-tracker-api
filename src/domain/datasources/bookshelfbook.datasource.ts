import { BookshelfBookEntity } from "@domain/entities";
import { AddToBookshelfDto } from "@domain/dtos/bookshelfBook/addToBookshelf-bookshelfBook.dto";
import { UpdateBookshelfDto } from "@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto";

export abstract class BookshelfBookDatasource {
    abstract addToBookshelf(addToBookshelfDto: AddToBookshelfDto): Promise<BookshelfBookEntity>;
    abstract updateBookshelf(updateBookshelfDto: UpdateBookshelfDto): Promise<BookshelfBookEntity>;
}