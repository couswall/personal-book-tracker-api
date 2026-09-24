import {BookshelfType} from '@/generated/prisma';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {RemoveFromBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {RemoveFromBookshelfUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';
import {getOwnedBookshelfBook} from '@domain/use-cases/bookshelfBook/ownership.helpers';
import {discardLatestRead} from '@domain/use-cases/bookshelfBook/readingSession.helpers';

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
        const {bookshelf} = await getOwnedBookshelfBook(
            this.repository,
            this.bookshelfRepository,
            removeFromBookshelfDto.bookshelfBookId,
            userId
        );

        const removedBook =
            await this.repository.removeFromBookshelf(removeFromBookshelfDto);

        if (bookshelf.type === BookshelfType.READ)
            await discardLatestRead(
                this.readingSessionRepository,
                userId,
                removedBook.bookId
            );

        return removedBook;
    }
}
