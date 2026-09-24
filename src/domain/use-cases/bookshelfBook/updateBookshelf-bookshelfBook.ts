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
import {
    discardLatestRead,
    finishReadingSession,
    startReadingSession,
} from '@domain/use-cases/bookshelfBook/readingSession.helpers';
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

        const {bookshelf: currentBookshelf} = await getOwnedBookshelfBook(
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

        if (currentBookshelf.id === bookshelfId) return bookshelfBook;

        await this.syncReadingSession(
            updateBookshelfDto,
            currentBookshelf.type,
            userId,
            bookshelfBook.bookId
        );

        return bookshelfBook;
    }

    private async syncReadingSession(
        {bookshelfType, finishedAt, discardLastRead}: UpdateBookshelfDto,
        previousType: BookshelfType,
        userId: number,
        bookId: number
    ): Promise<void> {
        const repository = this.readingSessionRepository;

        if (previousType === BookshelfType.READ) {
            // READ → CURRENTLY_READING is a re-read unless the user says the
            // previous read was a mistake; any other move un-finishes the book.
            const isReread =
                bookshelfType === BookshelfType.CURRENTLY_READING && !discardLastRead;
            if (!isReread) await discardLatestRead(repository, userId, bookId);
        }

        if (bookshelfType === BookshelfType.CURRENTLY_READING)
            await startReadingSession(repository, userId, bookId);

        if (bookshelfType === BookshelfType.READ)
            await finishReadingSession(repository, userId, bookId, finishedAt);
    }
}
