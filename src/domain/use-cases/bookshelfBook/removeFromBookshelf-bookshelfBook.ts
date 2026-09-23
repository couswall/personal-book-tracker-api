import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {RemoveFromBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {RemoveFromBookshelfUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';
import {getOwnedBookshelfBook} from '@domain/use-cases/bookshelfBook/ownership.helpers';

export class RemoveFromBookshelf implements RemoveFromBookshelfUseCase {
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookshelfRepository: BookshelfRepository
    ) {}

    async execute(
        removeFromBookshelfDto: RemoveFromBookshelfDto,
        userId: number
    ): Promise<BookshelfBookEntity> {
        await getOwnedBookshelfBook(
            this.repository,
            this.bookshelfRepository,
            removeFromBookshelfDto.bookshelfBookId,
            userId
        );

        return this.repository.removeFromBookshelf(removeFromBookshelfDto);
    }
}
