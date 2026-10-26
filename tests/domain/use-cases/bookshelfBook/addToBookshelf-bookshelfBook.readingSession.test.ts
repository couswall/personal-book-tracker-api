import {BookshelfType} from '@/generated/prisma';
import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfEntity} from '@domain/entities';
import {AddToBookshelf} from '@domain/use-cases';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {
    addToBookshelfDtoObject,
    bookEntity,
    bookshelfBookEntity,
    bookshelfEntity,
    readingSessionEntity,
} from '@tests/fixtures';

describe('addToBookshelf-bookshelfBook use case reading sessions', () => {
    const {
        mockBookRepository,
        mockBookshelfBookRepository,
        mockBookshelfRepository,
        mockReadingSessionRepository: sessions,
    } = getMockRepositories();
    const {userId} = bookshelfEntity;

    const addTo = async (type: BookshelfType, finishedAt?: Date | null) => {
        mockBookshelfRepository.getBookshelfById.mockResolvedValue(
            BookshelfEntity.fromObject({...bookshelfEntity, type})
        );
        const dto = new AddToBookshelfDto(
            addToBookshelfDtoObject.bookshelfId,
            addToBookshelfDtoObject.apiBookId,
            undefined,
            undefined,
            undefined,
            finishedAt
        );

        await new AddToBookshelf(
            mockBookshelfBookRepository,
            mockBookRepository,
            mockBookshelfRepository,
            sessions
        ).execute(dto, userId);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockBookRepository.findOrCreateByApiId.mockResolvedValue(bookEntity);
        mockBookshelfBookRepository.addToBookshelf.mockResolvedValue(bookshelfBookEntity);
        sessions.findOpenSession.mockResolvedValue(null);
    });

    test('should not create a reading session when added to TO_BE_READ', async () => {
        await addTo(BookshelfType.TO_BE_READ);

        expect(sessions.findOpenSession).not.toHaveBeenCalled();
        expect(sessions.createSession).not.toHaveBeenCalled();
    });

    test('should open a reading session when added to CURRENTLY_READING', async () => {
        await addTo(BookshelfType.CURRENTLY_READING);

        expect(sessions.createSession).toHaveBeenCalledWith({
            userId,
            bookId: bookEntity.id,
            startedAt: expect.any(Date),
            finishedAt: null,
        });
    });

    test('should not open a second session when one is already open', async () => {
        sessions.findOpenSession.mockResolvedValue(readingSessionEntity);

        await addTo(BookshelfType.CURRENTLY_READING);

        expect(sessions.createSession).not.toHaveBeenCalled();
    });

    test('should create a session finished on the given date when added to READ', async () => {
        const finishedAt = new Date('2019-06-01T00:00:00Z');

        await addTo(BookshelfType.READ, finishedAt);

        expect(sessions.createSession).toHaveBeenCalledWith({
            userId,
            bookId: bookEntity.id,
            startedAt: finishedAt,
            finishedAt,
        });
    });

    test.each([undefined, null])(
        'should not guess a finish date when added to READ with finishedAt %s',
        async (finishedAt) => {
            await addTo(BookshelfType.READ, finishedAt);

            expect(sessions.findOpenSession).not.toHaveBeenCalled();
            expect(sessions.createSession).not.toHaveBeenCalled();
        }
    );
});
