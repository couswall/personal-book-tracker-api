import {prisma} from '@data/postgres';
import {BookshelfType} from '@/generated/prisma';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {bookshelfObj, bookshelfPrisma, readBookshelfPrisma} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        book: {findUnique: jest.fn()},
        bookshelf: {findMany: jest.fn()},
        readingSession: {findFirst: jest.fn()},
        readingChallenge: {findUnique: jest.fn()},
    },
}));

describe('BookshelfDatasourceImpl.getBookshelvesWithStatus hasChallenge', () => {
    const datasource = new BookshelfDatasourceImpl();
    const {userId} = bookshelfObj;
    const bookPrisma = {id: 7};

    const withBook = (shelf: {id: number; type: BookshelfType}, hasBook: boolean) => ({
        ...shelf,
        _count: {books: 1},
        books: hasBook
            ? [{id: 101, readingProgress: 100, currentPage: 300, progressType: null}]
            : [],
    });

    const getStatus = () => datasource.getBookshelvesWithStatus(userId, 'abc123');

    const finishedOn = (isoDate: string) =>
        (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue({
            finishedAt: new Date(isoDate),
        });

    beforeEach(() => {
        jest.clearAllMocks();
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook(bookshelfPrisma, false),
            withBook(readBookshelfPrisma, true),
        ]);
    });

    test('should be true on the READ shelf when the finish year has a challenge', async () => {
        finishedOn('2026-03-15T00:00:00Z');
        (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue({id: 1});

        const [otherShelf, readShelf] = await getStatus();

        expect(prisma.readingChallenge.findUnique).toHaveBeenCalledWith({
            where: {userId_year: {userId, year: 2026}},
            select: {id: true},
        });
        expect(readShelf.hasChallenge).toBe(true);
        expect(otherShelf.hasChallenge).toBe(false);
    });

    test('should be false when the user set no challenge for the finish year', async () => {
        finishedOn('2026-03-15T00:00:00Z');
        (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue(null);

        const [, readShelf] = await getStatus();

        expect(readShelf.finishedAt).toEqual(new Date('2026-03-15T00:00:00Z'));
        expect(readShelf.hasChallenge).toBe(false);
    });

    test('should use the UTC year of the finish date', async () => {
        finishedOn('2025-12-31T23:30:00Z');
        (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue(null);

        await getStatus();

        expect(prisma.readingChallenge.findUnique).toHaveBeenCalledWith(
            expect.objectContaining({where: {userId_year: {userId, year: 2025}}})
        );
    });

    test('should not look up a challenge when the finish date is unknown', async () => {
        (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue(null);

        const [, readShelf] = await getStatus();

        expect(prisma.readingChallenge.findUnique).not.toHaveBeenCalled();
        expect(readShelf.hasChallenge).toBe(false);
    });

    test('should be false when the book is not on the READ shelf', async () => {
        finishedOn('2026-03-15T00:00:00Z');
        (prisma.readingChallenge.findUnique as jest.Mock).mockResolvedValue({id: 1});
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook({...bookshelfPrisma, type: BookshelfType.CURRENTLY_READING}, true),
            withBook(readBookshelfPrisma, false),
        ]);

        const result = await getStatus();

        expect(result.map(({hasChallenge}) => hasChallenge)).toEqual([false, false]);
    });
});
