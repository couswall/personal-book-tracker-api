import {BookshelfType} from '@/generated/prisma';
import {UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfEntity, ReadingSessionEntity} from '@domain/entities';
import {UpdateBookshelf} from '@domain/use-cases/bookshelfBook/updateBookshelf-bookshelfBook';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {
    bookshelfBookEntity,
    bookshelfEntity,
    readingSessionEntity,
    readingSessionObject,
} from '@tests/fixtures';

describe('updateBookshelf-bookshelfBook use case reading sessions', () => {
    const {
        mockBookRepository,
        mockBookshelfBookRepository,
        mockBookshelfRepository,
        mockReadingSessionRepository: sessions,
    } = getMockRepositories();
    const {userId} = bookshelfEntity;
    const {bookId} = bookshelfBookEntity;
    const TARGET_ID = 1;

    const shelf = (id: number, type: BookshelfType): BookshelfEntity =>
        BookshelfEntity.fromObject({...bookshelfEntity, id, type});

    const move = async (
        from: BookshelfType,
        to: BookshelfType,
        options: {finishedAt?: Date | null; discardLastRead?: boolean} = {}
    ) => {
        const fromShelf = shelf(bookshelfBookEntity.bookshelfId, from);
        const toShelf = shelf(TARGET_ID, to);
        mockBookshelfRepository.getBookshelfById.mockImplementation(async (id) =>
            id === fromShelf.id ? fromShelf : toShelf
        );
        const dto = new UpdateBookshelfDto(
            bookshelfBookEntity.id,
            TARGET_ID,
            undefined,
            options.finishedAt,
            options.discardLastRead
        );

        await new UpdateBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            sessions
        ).execute(dto, userId);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue(
            bookshelfBookEntity
        );
        mockBookshelfBookRepository.updateBookshelf.mockResolvedValue(
            bookshelfBookEntity
        );
        sessions.findOpenSession.mockResolvedValue(null);
        sessions.findLatestFinishedSession.mockResolvedValue(readingSessionEntity);
    });

    test('should not touch reading sessions when the book stays on the same bookshelf', async () => {
        const readShelf = shelf(TARGET_ID, BookshelfType.READ);
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue({
            ...bookshelfBookEntity,
            bookshelfId: TARGET_ID,
        });
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(readShelf);

        await new UpdateBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            sessions
        ).execute(new UpdateBookshelfDto(bookshelfBookEntity.id, TARGET_ID), userId);

        expect(sessions.findOpenSession).not.toHaveBeenCalled();
        expect(sessions.createSession).not.toHaveBeenCalled();
        expect(sessions.findLatestFinishedSession).not.toHaveBeenCalled();
    });

    test('should not touch reading sessions when moving between non-READ shelves', async () => {
        await move(BookshelfType.CURRENTLY_READING, BookshelfType.TO_BE_READ);

        expect(sessions.findOpenSession).not.toHaveBeenCalled();
        expect(sessions.createSession).not.toHaveBeenCalled();
        expect(sessions.findLatestFinishedSession).not.toHaveBeenCalled();
    });

    test('should open a reading session when moved to CURRENTLY_READING', async () => {
        await move(BookshelfType.TO_BE_READ, BookshelfType.CURRENTLY_READING);

        expect(sessions.createSession).toHaveBeenCalledWith({
            userId,
            bookId,
            startedAt: expect.any(Date),
            finishedAt: null,
        });
    });

    test('should create a session finished now when moved to READ without a date', async () => {
        await move(BookshelfType.TO_BE_READ, BookshelfType.READ);

        const [{startedAt, finishedAt}] = sessions.createSession.mock.calls[0];
        expect(finishedAt).toEqual(expect.any(Date));
        expect(startedAt).toBe(finishedAt);
    });

    test('should finish the open session on the given date when moved to READ', async () => {
        const finishedAt = new Date('2026-03-15T00:00:00Z');
        const openSession = ReadingSessionEntity.fromObject({
            ...readingSessionObject,
            startedAt: new Date('2026-03-01T10:00:00Z'),
            finishedAt: null,
        });
        sessions.findOpenSession.mockResolvedValue(openSession);

        await move(BookshelfType.CURRENTLY_READING, BookshelfType.READ, {finishedAt});

        expect(sessions.finishSession).toHaveBeenCalledWith(openSession.id, {
            finishedAt,
        });
    });

    test('should discard the open session when moved to READ with an unknown date', async () => {
        sessions.findOpenSession.mockResolvedValue(readingSessionEntity);

        await move(BookshelfType.CURRENTLY_READING, BookshelfType.READ, {
            finishedAt: null,
        });

        expect(sessions.discardSession).toHaveBeenCalledWith(readingSessionEntity.id);
        expect(sessions.finishSession).not.toHaveBeenCalled();
    });

    test('should discard the latest read when moved from READ to TO_BE_READ', async () => {
        await move(BookshelfType.READ, BookshelfType.TO_BE_READ);

        expect(sessions.findLatestFinishedSession).toHaveBeenCalledWith(userId, bookId);
        expect(sessions.discardSession).toHaveBeenCalledWith(readingSessionEntity.id);
        expect(sessions.createSession).not.toHaveBeenCalled();
    });

    test('should keep the previous read and open a new session for a re-read', async () => {
        await move(BookshelfType.READ, BookshelfType.CURRENTLY_READING);

        expect(sessions.findLatestFinishedSession).not.toHaveBeenCalled();
        expect(sessions.discardSession).not.toHaveBeenCalled();
        expect(sessions.createSession).toHaveBeenCalledWith(
            expect.objectContaining({finishedAt: null})
        );
    });

    test('should discard the previous read when it was marked as read by mistake', async () => {
        await move(BookshelfType.READ, BookshelfType.CURRENTLY_READING, {
            discardLastRead: true,
        });

        expect(sessions.discardSession).toHaveBeenCalledWith(readingSessionEntity.id);
        expect(sessions.createSession).toHaveBeenCalledWith(
            expect.objectContaining({finishedAt: null})
        );
    });
});
