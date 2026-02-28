import { BookEntity } from "@/src/domain/entities/book.entity";
import { BookDatasource } from "@domain/datasources/book.datasource";
import { BookRepository } from "@domain/repositories/book.repository";
import { CreateBookDto, GetBookByIdDto, SearchBookDto } from "@domain/dtos/index";
import { ISearchBookResponse } from "@domain/interfaces/book.interfaces";

export class BookRepositoryImpl implements BookRepository{
    constructor(
        private readonly datasource: BookDatasource,
    ){};

    search(searchBookDto: SearchBookDto): Promise<ISearchBookResponse> {
        return this.datasource.search(searchBookDto);
    }

    getBookById(getBookByIdDto: GetBookByIdDto): Promise<BookEntity> {
        return this.datasource.getBookById(getBookByIdDto);
    }

    fetchByIdFromAPI(getBookByIdDto: GetBookByIdDto): Promise<BookEntity> {
        return this.datasource.fetchByIdFromAPI(getBookByIdDto);
    }

    create(createBookDto: CreateBookDto): Promise<BookEntity> {
        return this.datasource.create(createBookDto);
    }

    findOrCreateByApiId(apiBookId: string): Promise<BookEntity> {
        return this.datasource.findOrCreateByApiId(apiBookId);
    }
}