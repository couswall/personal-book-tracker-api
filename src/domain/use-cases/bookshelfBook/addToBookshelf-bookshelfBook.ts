import {BookshelfType} from '@/generated/prisma';
import {BookshelfBookRepository} from '@domain/repositories/bookshelfBook.repository';
import {BookRepository} from '@domain/repositories/book.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {ReadingSessionRepository} from '@domain/repositories/readingSession.repository';
import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfBookEntity} from '@domain/entities';
import {AddToBookshelfUseCase} from '@domain/use-cases/interfaces/bookshelfBook.interfaces';
import {getOwnedBookshelf} from '@domain/use-cases/bookshelfBook/ownership.helpers';

export class AddToBookshelf implements AddToBookshelfUseCase {
    constructor(
        public readonly repository: BookshelfBookRepository,
        public readonly bookRepository: BookRepository,
        public readonly bookshelfRepository: BookshelfRepository,
        public readonly readingSessionRepository: ReadingSessionRepository
    ) {}

    async execute(
        addToBookshelfDto: AddToBookshelfDto,
        userId: number
    ): Promise<BookshelfBookEntity> {
        const {type} = await getOwnedBookshelf(
            this.bookshelfRepository,
            addToBookshelfDto.bookshelfId,
            userId
        );
        const {id: bookId, pageCount} = await this.bookRepository.findOrCreateByApiId(
            addToBookshelfDto.apiBookId
        );

        addToBookshelfDto.bookId = bookId;
        addToBookshelfDto.totalPages = pageCount;
        addToBookshelfDto.bookshelfType = type;

        const bookshelfBook = await this.repository.addToBookshelf(addToBookshelfDto);

        if (type === BookshelfType.CURRENTLY_READING || type === BookshelfType.READ) {
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
            }
        }

        return bookshelfBook;
    }
}
