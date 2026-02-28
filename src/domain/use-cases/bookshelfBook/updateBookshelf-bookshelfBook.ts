import { UpdateBookshelfDto } from "@domain/dtos";
import { BookshelfBookEntity } from "@domain/entities";
import { BookshelfBookRepository } from "@domain/repositories/bookshelfBook.repository";
import { BookRepository } from "@domain/repositories/book.repository";
import { BookshelfRepository } from "@domain/repositories/bookshelf.repository";
import { UpdateBookshelfUseCase } from "@domain/use-cases/interfaces/bookshelfBook.interfaces";

export class UpdateBookshelf implements UpdateBookshelfUseCase{
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookRepository: BookRepository,
        public readonly bookshelfRepository: BookshelfRepository,
    ){};

    async execute(updateBookshelfDto: UpdateBookshelfDto): Promise<BookshelfBookEntity> {
        const {bookshelfId} = updateBookshelfDto;

        const {type} = await this.bookshelfRepository.getBookshelfById(bookshelfId);

        updateBookshelfDto.bookshelfType = type;

        return this.repository.updateBookshelf(updateBookshelfDto);
    }
}