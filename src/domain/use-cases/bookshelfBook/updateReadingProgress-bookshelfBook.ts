import {BookshelfType} from '@/generated/prisma';
import {UpdateReadingProgressDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookRepository} from '@domain/repositories/book.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {UpdateReadingProgressUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';

export class UpdateReadingProgress implements UpdateReadingProgressUseCase {
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookRepository: BookRepository,
        public readonly bookshelfRepository: BookshelfRepository,
        public readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    async execute(
        updateReadingProgressDto: UpdateReadingProgressDto
    ): Promise<BookshelfBookEntity> {
        if (!updateReadingProgressDto.isFinished)
            return this.repository.updateReadingProgress(updateReadingProgressDto);

        return this.finish(updateReadingProgressDto.bookshelfBookId);
    }

    private async finish(bookshelfBookId: number): Promise<BookshelfBookEntity> {
        const bookshelfBook = await this.repository.getBookshelfBookById(bookshelfBookId);
        const {userId} = await this.bookshelfRepository.getBookshelfById(
            bookshelfBook.bookshelfId
        );
        const readBookshelf = await this.bookshelfRepository.getBookshelfByUserAndType(
            userId,
            BookshelfType.READ
        );

        const updatedBookshelfBook = await this.repository.finishReadingProgress(
            bookshelfBookId,
            readBookshelf.id
        );

        await this.syncReadingSession(userId, bookshelfBook.bookId);

        return updatedBookshelfBook;
    }

    private async syncReadingSession(userId: number, bookId: number): Promise<void> {
        const openSession = await this.readingSessionRepository.findOpenSession(
            userId,
            bookId
        );

        if (openSession) {
            await this.readingSessionRepository.finishSession(openSession.id);
            return;
        }

        const now = new Date();
        await this.readingSessionRepository.createSession({
            userId,
            bookId,
            startedAt: now,
            finishedAt: now,
        });
    }
}
