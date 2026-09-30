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

const {READ, CURRENTLY_READING, TO_BE_READ} = BookshelfType;

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
    const finishedAt = new Date('2026-03-15T00:00:00Z');

    const shelf = (id: number, type: BookshelfType): BookshelfEntity =>
        BookshelfEntity.fromObject({...bookshelfEntity, id, type});

    const move = async (from: BookshelfType, to: BookshelfType, date?: Date | null) => {
        const fromShelf = shelf(bookshelfBookEntity.bookshelfId, from);
        const toShelf = shelf(TARGET_ID, to);
        mockBookshelfRepository.getBookshelfById.mockImplementation(async (id) =>
            id === fromShelf.id ? fromShelf : toShelf
        );

        await new UpdateBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            sessions
        ).execute(
            new UpdateBookshelfDto(bookshelfBookEntity.id, TARGET_ID, undefined, date),
            userId
        );
    };

    const expectNoSessionChanges = () => {
        expect(sessions.createSession).not.toHaveBeenCalled();
        expect(sessions.finishSession).not.toHaveBeenCalled();
        expect(sessions.discardSession).not.toHaveBeenCalled();
        expect(sessions.discardAllSessions).not.toHaveBeenCalled();
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
    });

    test('should not touch reading records when the book stays on the same bookshelf', async () => {
        mockBookshelfBookRepository.getBookshelfBookById.mockResolvedValue({
            ...bookshelfBookEntity,
            bookshelfId: TARGET_ID,
        });
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(
            shelf(TARGET_ID, READ)
        );

        await new UpdateBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            sessions
        ).execute(new UpdateBookshelfDto(bookshelfBookEntity.id, TARGET_ID), userId);

        expect(sessions.findOpenSession).not.toHaveBeenCalled();
        expectNoSessionChanges();
    });

    describe('Currently Reading →', () => {
        test('Read should finish the open record now', async () => {
            sessions.findOpenSession.mockResolvedValue(readingSessionEntity);

            await move(CURRENTLY_READING, READ);

            expect(sessions.finishSession).toHaveBeenCalledWith(readingSessionEntity.id, {
                finishedAt: expect.any(Date),
            });
        });

        test('Read should finish the open record on the given date', async () => {
            const openSession = ReadingSessionEntity.fromObject({
                ...readingSessionObject,
                startedAt: new Date('2026-03-01T10:00:00Z'),
                finishedAt: null,
            });
            sessions.findOpenSession.mockResolvedValue(openSession);

            await move(CURRENTLY_READING, READ, finishedAt);

            expect(sessions.finishSession).toHaveBeenCalledWith(openSession.id, {
                finishedAt,
            });
        });

        test('To Be Read should drop the in-progress record', async () => {
            sessions.findOpenSession.mockResolvedValue(readingSessionEntity);

            await move(CURRENTLY_READING, TO_BE_READ);

            expect(sessions.discardSession).toHaveBeenCalledWith(readingSessionEntity.id);
            expect(sessions.discardAllSessions).not.toHaveBeenCalled();
            expect(sessions.createSession).not.toHaveBeenCalled();
        });
    });

    describe('To Be Read →', () => {
        test('Read without a date should not record a finish', async () => {
            await move(TO_BE_READ, READ);

            expect(sessions.findOpenSession).not.toHaveBeenCalled();
            expectNoSessionChanges();
        });

        test('Read with a date should record a finish on that date', async () => {
            await move(TO_BE_READ, READ, finishedAt);

            expect(sessions.createSession).toHaveBeenCalledWith({
                userId,
                bookId,
                startedAt: finishedAt,
                finishedAt,
            });
        });

        test('Currently Reading should open a reading record', async () => {
            await move(TO_BE_READ, CURRENTLY_READING);

            expect(sessions.createSession).toHaveBeenCalledWith({
                userId,
                bookId,
                startedAt: expect.any(Date),
                finishedAt: null,
            });
        });
    });

    describe('Read →', () => {
        test('Currently Reading should keep past finishes and open a new record (re-read)', async () => {
            await move(READ, CURRENTLY_READING);

            expect(sessions.discardSession).not.toHaveBeenCalled();
            expect(sessions.discardAllSessions).not.toHaveBeenCalled();
            expect(sessions.createSession).toHaveBeenCalledWith(
                expect.objectContaining({finishedAt: null})
            );
        });

        test('To Be Read should keep past finishes', async () => {
            await move(READ, TO_BE_READ);

            expect(sessions.findOpenSession).not.toHaveBeenCalled();
            expectNoSessionChanges();
        });
    });
});
