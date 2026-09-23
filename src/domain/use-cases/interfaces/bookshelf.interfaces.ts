import {BookshelfEntity} from '@domain/entities/index';
import {GetBookshelvesWithStatusDto} from '@domain/dtos/bookshelf/getBookshelvesWithStatus-bookshelf.dto';
import {IBookshelfWithStatus} from '@domain/interfaces/bookshelf.interfaces';

export interface GetMyBookShelvesUseCase {
    execute(userId: number): Promise<BookshelfEntity[]>;
}

export interface GetBookshelvesWithStatusUseCase {
    execute(
        userId: number,
        dto: GetBookshelvesWithStatusDto
    ): Promise<IBookshelfWithStatus[]>;
}
