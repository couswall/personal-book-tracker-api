import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {RemoveFromBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {RemoveFromBookshelfUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';

export class RemoveFromBookshelf implements RemoveFromBookshelfUseCase {
    constructor(public readonly repository: BookshelfBookRepository) {}

    execute(
        removeFromBookshelfDto: RemoveFromBookshelfDto
    ): Promise<BookshelfBookEntity> {
        return this.repository.removeFromBookshelf(removeFromBookshelfDto);
    }
}
