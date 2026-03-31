import { BookshelfEntity } from "@domain/entities/index";
import { CreateCustomBookShelfDto } from "@domain/dtos/bookshelf/createCustom-bookshelf.dto";
import { IBookshelfWithStatus } from "@domain/interfaces/bookshelf.interfaces";

export abstract class BookshelfRepository{
    abstract createCustom(createBookShelfDto: CreateCustomBookShelfDto): Promise<BookshelfEntity>;
    abstract getMyBookshelves(userId: number): Promise<BookshelfEntity[]>;
    abstract getBookshelfById(bookshelfId: number): Promise<BookshelfEntity>;
    abstract getBookshelvesWithStatus(userId: number, apiBookId: string): Promise<IBookshelfWithStatus[]>;
}