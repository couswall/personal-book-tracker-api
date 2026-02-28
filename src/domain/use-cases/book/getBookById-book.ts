import { BookRepository } from "@domain/repositories/book.repository";
import { GetBookByIdDto } from "@domain/dtos/index";
import { BookEntity } from "@domain/entities/book.entity";
import { GetBookByIdUseCase } from "@domain/use-cases/interfaces/book.interfaces";

export class GetBookById implements GetBookByIdUseCase{
    constructor(
        private readonly repository: BookRepository,
    ){};

    execute(getBookByIdDto: GetBookByIdDto): Promise<BookEntity> {
        return this.repository.getBookById(getBookByIdDto);
    }
}