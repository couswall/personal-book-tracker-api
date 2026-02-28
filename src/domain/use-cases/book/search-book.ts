import { SearchBookDto } from "@domain/dtos/index";
import { ISearchBookResponse } from "@domain/interfaces/book.interfaces";
import { BookRepository } from "@domain/repositories/book.repository";
import { SearchBookUseCase } from "@domain/use-cases/interfaces/book.interfaces";

export class SearchBook implements SearchBookUseCase{
    constructor(
        private readonly repository: BookRepository,
    ){};

    async execute(searchBookDto: SearchBookDto): Promise<ISearchBookResponse> {
        return this.repository.search(searchBookDto);
    }
}