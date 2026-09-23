import {BookshelfType} from '@/generated/prisma';
import {UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookRepository} from '@domain/repositories/book.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {
    getOwnedBookshelf,
    getOwnedBookshelfBook,
} from '@domain/use-cases/bookshelfBook/ownership.helpers';
import {UpdateBookshelfUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';

export class UpdateBookshelf implements UpdateBookshelfUseCase {
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookRepository: BookRepository,
        public readonly bookshelfRepository: BookshelfRepository,
        public readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    async execute(
        updateBookshelfDto: UpdateBookshelfDto,
        userId: number
    ): Promise<BookshelfBookEntity> {
        const {bookshelfBookId, bookshelfId} = updateBookshelfDto;

        await getOwnedBookshelfBook(
            this.repository,
            this.bookshelfRepository,
            bookshelfBookId,
            userId
        );
        const {type} = await getOwnedBookshelf(
            this.bookshelfRepository,
            bookshelfId,
            userId
        );

        updateBookshelfDto.bookshelfType = type;

        const bookshelfBook = await this.repository.updateBookshelf(updateBookshelfDto);

        if (type === BookshelfType.CURRENTLY_READING || type === BookshelfType.READ) {
            await this.syncReadingSession(userId, bookshelfBook.bookId, type);
        }

        return bookshelfBook;
    }

    private async syncReadingSession(
        userId: number,
        bookId: number,
        type: BookshelfType
    ): Promise<void> {
        const openSession = await this.readingSessionRepository.findOpenSession(
            userId,
            bookId
        );

        if (!openSession) {
            const now = new Date();
            await this.readingSessionRepository.createSession({
                userId,
                bookId,
                startedAt: now,
                finishedAt: type === BookshelfType.READ ? now : null,
            });
            return;
        }

        if (type === BookshelfType.READ) {
            await this.readingSessionRepository.finishSession(openSession.id);
        }
    }
}
