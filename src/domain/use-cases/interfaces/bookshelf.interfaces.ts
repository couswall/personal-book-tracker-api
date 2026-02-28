import { BookshelfEntity } from "@domain/entities/index";
import { CreateCustomBookShelfDto } from "@domain/dtos/bookshelf/createCustom-bookshelf.dto";

export interface CreateCustomUseCase{
    execute(createBookShelfDto: CreateCustomBookShelfDto): Promise<BookshelfEntity>;
}

export interface GetMyBookShelvesUseCase{
    execute(userId: number): Promise<BookshelfEntity[]>;
}