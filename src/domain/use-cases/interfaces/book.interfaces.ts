import {GetBookByIdDto, SearchBookDto} from '@domain/dtos/index';
import {ISearchBookResponse} from '@domain/interfaces/book.interfaces';
import {BookEntity} from '@domain/entities/book.entity';

export interface SearchBookUseCase {
    execute(searchBookDto: SearchBookDto): Promise<ISearchBookResponse>;
}

export interface GetBookByIdUseCase {
    execute(getBookByIdDto: GetBookByIdDto): Promise<BookEntity>;
}
