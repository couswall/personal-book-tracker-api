import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {RemoveFromBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {RemoveFromBookshelfUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';
import {getOwnedBookshelfBook} from '@domain/use-cases/bookshelfBook/ownership.helpers';

export class RemoveFromBookshelf implements RemoveFromBookshelfUseCase {
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookshelfRepository: BookshelfRepository,
        public readonly readingSessionRepository: ReadingSessionRepository
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

        const removedBook =
            await this.repository.removeFromBookshelf(removeFromBookshelfDto);

        // Removing a book from the library also removes all of its reading history.
        await this.readingSessionRepository.discardAllSessions(
            userId,
            removedBook.bookId
        );

        return removedBook;
    }
}
