import { BookshelfBookEntity } from "@domain/entities";
import { BookshelfBookDatasource } from "@domain/datasources/bookshelfbook.datasource";
import { BookshelfBookRepository } from "@domain/repositories/bookshelfBook.repository";
import { AddToBookshelfDto } from "@domain/dtos/bookshelfBook/addToBookshelf-bookshelfBook.dto";
import { UpdateBookshelfDto } from "@domain/dtos/bookshelfBook/updateBookshelf-bookshelfBook.dto";

export class BookshelfBookRepositoryImpl implements BookshelfBookRepository{
    constructor(
        private readonly datasource: BookshelfBookDatasource
    ){};
    
    addToBookshelf(addToBookshelfDto: AddToBookshelfDto): Promise<BookshelfBookEntity> {
        return this.datasource.addToBookshelf(addToBookshelfDto);
    }

    updateBookshelf(updateBookshelfDto: UpdateBookshelfDto): Promise<BookshelfBookEntity> {
        return this.datasource.updateBookshelf(updateBookshelfDto);
    }
}