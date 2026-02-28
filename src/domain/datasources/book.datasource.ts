import { GetBookByIdDto, SearchBookDto, CreateBookDto } from "@domain/dtos/index";
import { BookEntity } from "@domain/entities/book.entity";
import { ISearchBookResponse } from "@domain/interfaces/book.interfaces";

export abstract class BookDatasource {
    abstract search(searchBookDto: SearchBookDto): Promise<ISearchBookResponse>;
    abstract getBookById(getBookByIdDto: GetBookByIdDto): Promise<BookEntity>;
    abstract fetchByIdFromAPI(getBookByIdDto: GetBookByIdDto): Promise<BookEntity>
    abstract create(createBookDto: CreateBookDto): Promise<BookEntity>;
    abstract findOrCreateByApiId(apiBookId: string): Promise<BookEntity>;
}