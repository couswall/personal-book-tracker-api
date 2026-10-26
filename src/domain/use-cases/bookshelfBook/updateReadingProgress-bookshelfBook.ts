import {BookshelfType} from '@/generated/prisma';
import {UpdateReadingProgressDto} from '@domain/dtos';
import {BookshelfBookEntity, BookshelfEntity} from '@domain/entities';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookRepository} from '@domain/repositories/book.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {getOwnedBookshelfBook} from '@domain/use-cases/bookshelfBook/ownership.helpers';
import {finishReadingSession} from '@domain/use-cases/bookshelfBook/readingSession.helpers';
import {UpdateReadingProgressUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';

export class UpdateReadingProgress implements UpdateReadingProgressUseCase {
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookRepository: BookRepository,
        public readonly bookshelfRepository: BookshelfRepository,
        public readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    async execute(
        updateReadingProgressDto: UpdateReadingProgressDto,
        userId: number
    ): Promise<BookshelfBookEntity> {
        const {bookshelfBook, bookshelf} = await getOwnedBookshelfBook(
            this.repository,
            this.bookshelfRepository,
            updateReadingProgressDto.bookshelfBookId,
            userId
        );

        if (!updateReadingProgressDto.isFinished)
            return this.repository.updateReadingProgress(updateReadingProgressDto);

        return this.finish(updateReadingProgressDto, bookshelfBook, bookshelf, userId);
    }

    private async finish(
        {bookshelfBookId, finishedAt}: UpdateReadingProgressDto,
        bookshelfBook: BookshelfBookEntity,
        currentBookshelf: BookshelfEntity,
        userId: number
    ): Promise<BookshelfBookEntity> {
        const readBookshelf = await this.bookshelfRepository.getBookshelfByUserAndType(
            userId,
            BookshelfType.READ
        );

        const updatedBookshelfBook = await this.repository.finishReadingProgress(
            bookshelfBookId,
            readBookshelf.id
        );

        // Finishing a book that is already on READ must not count it twice.
        if (currentBookshelf.type !== BookshelfType.READ)
            await finishReadingSession(
                this.readingSessionRepository,
                userId,
                bookshelfBook.bookId,
                finishedAt
            );

        return updatedBookshelfBook;
    }
}
