import { BookshelfEntity } from "@domain/entities/index";
import { CreateCustomBookShelfDto } from "@domain/dtos/bookshelf/createCustom-bookshelf.dto";

export abstract class BookshelfDatasource{
    abstract createCustom(createBookShelfDto: CreateCustomBookShelfDto): Promise<BookshelfEntity>;
    abstract getMyBookshelves(userId: number): Promise<BookshelfEntity[]>;
    abstract getBookshelfById(bookshelfId: number): Promise<BookshelfEntity>;
}