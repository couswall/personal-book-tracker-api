import {BookshelfType} from '@/generated/prisma';
import {ReadingChallengeRepository} from '@domain/repositories/readingChallenge.repository';
import {GetDashboard} from '@domain/use-cases';
import {getMockRepositories} from '@tests/domain/use-cases/setup';
import {
    bookshelfCount,
    finishedReadingObject,
    readingChallengeEntity,
    shelfBook,
} from '@tests/fixtures';

describe('GetDashboard use case', () => {
    const readingChallengeRepository: jest.Mocked<ReadingChallengeRepository> = {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByYear: jest.fn(),
        findAllByUser: jest.fn(),
    };
    const {mockBookshelfRepository: shelves, mockReadingSessionRepository: sessions} =
        getMockRepositories();
    const {userId} = readingChallengeEntity;
    const now = new Date('2026-07-02T12:00:00Z');

    const execute = () =>
        new GetDashboard(shelves, readingChallengeRepository, sessions).execute(
            userId,
            now
        );

    const currentlyReadingCount = {
        ...bookshelfCount,
        id: 2,
        type: BookshelfType.CURRENTLY_READING,
        bookCount: 4,
    };
    const toBeReadCount = {...bookshelfCount, type: BookshelfType.TO_BE_READ};

    beforeEach(() => {
        jest.clearAllMocks();
        shelves.getBookshelfCounts.mockResolvedValue([
            currentlyReadingCount,
            toBeReadCount,
        ]);
        shelves.getShelfBooks.mockResolvedValue([shelfBook]);
        readingChallengeRepository.findByYear.mockResolvedValue(readingChallengeEntity);
        sessions.getFinishedInRange.mockResolvedValue([
            finishedReadingObject,
            {...finishedReadingObject, finishedAt: new Date('2026-07-01T00:00:00Z')},
        ]);
    });

    test('should fetch 3 currently reading and 8 want to read books', async () => {
        await execute();

        expect(shelves.getBookshelfCounts).toHaveBeenCalledWith(userId);
        expect(shelves.getShelfBooks).toHaveBeenCalledWith(
            userId,
            BookshelfType.CURRENTLY_READING,
            3
        );
        expect(shelves.getShelfBooks).toHaveBeenCalledWith(
            userId,
            BookshelfType.TO_BE_READ,
            8
        );
    });

    test('should return shelf previews with each shelf total', async () => {
        const result = await execute();

        expect(result.shelves).toEqual([currentlyReadingCount, toBeReadCount]);
        expect(result.currentlyReading).toEqual({total: 4, books: [shelfBook]});
        expect(result.wantToRead).toEqual({
            total: toBeReadCount.bookCount,
            books: [
                {
                    bookshelfBookId: shelfBook.bookshelfBookId,
                    apiBookId: shelfBook.apiBookId,
                    title: shelfBook.title,
                    coverImageUrl: shelfBook.coverImageUrl,
                },
            ],
        });
    });

    test('should return the current year challenge without the book and month lists', async () => {
        const result = await execute();

        expect(readingChallengeRepository.findByYear).toHaveBeenCalledWith({
            userId,
            year: 2026,
        });
        expect(result.readingChallenge).toEqual({
            year: 2026,
            goal: readingChallengeEntity.goal,
            booksRead: 2,
            booksThisMonth: 1,
            progress: expect.objectContaining({remaining: 18, status: 'BEHIND'}),
        });
    });

    test('should return a total of 0 for a shelf type the user does not have', async () => {
        shelves.getBookshelfCounts.mockResolvedValue([toBeReadCount]);
        shelves.getShelfBooks.mockResolvedValue([]);

        const result = await execute();

        expect(result.currentlyReading).toEqual({total: 0, books: []});
    });

    test('should return null goal and progress when no challenge was set', async () => {
        readingChallengeRepository.findByYear.mockResolvedValue(null);

        const result = await execute();

        expect(result.readingChallenge).toMatchObject({
            goal: null,
            booksRead: 2,
            progress: null,
        });
    });
});
