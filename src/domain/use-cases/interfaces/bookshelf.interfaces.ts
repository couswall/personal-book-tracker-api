import {BookshelfEntity} from '@domain/entities/index';
import {CreateCustomBookShelfDto} from '@domain/dtos/bookshelf/createCustom-bookshelf.dto';
import {GetBookshelvesWithStatusDto} from '@domain/dtos/bookshelf/getBookshelvesWithStatus-bookshelf.dto';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';

export interface CreateCustomUseCase {
    execute(createBookShelfDto: CreateCustomBookShelfDto): Promise<BookshelfEntity>;
}

export interface GetMyBookShelvesUseCase {
    execute(userId: number): Promise<BookshelfEntity[]>;
}

export interface GetBookshelvesWithStatusUseCase {
    execute(dto: GetBookshelvesWithStatusDto): Promise<IBookshelfWithStatus[]>;
}
