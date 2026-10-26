import {prisma} from '@data/postgres';
import {BookshelfType} from '@/generated/prisma';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {bookshelfObj, bookshelfPrisma, readBookshelfPrisma} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        book: {findUnique: jest.fn()},
        bookshelf: {findMany: jest.fn()},
        readingSession: {findMany: jest.fn()},
        readingChallenge: {findMany: jest.fn()},
    },
}));

describe('BookshelfDatasourceImpl.getBookshelvesWithStatus type and reads', () => {
    const datasource = new BookshelfDatasourceImpl();
    const {userId} = bookshelfObj;
    const bookPrisma = {id: 7};
    const read2026 = new Date('2026-03-15T00:00:00Z');
    const read2021 = new Date('2021-12-31T23:30:00Z');

    const withBook = (shelf: {id: number; type: BookshelfType}, hasBook: boolean) => ({
        ...shelf,
        _count: {books: 1},
        books: hasBook
            ? [{id: 101, readingProgress: 100, currentPage: 300, progressType: null}]
            : [],
    });

    const getStatus = () => datasource.getBookshelvesWithStatus(userId, 'abc123');

    beforeEach(() => {
        jest.clearAllMocks();
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook(bookshelfPrisma, false),
            withBook(readBookshelfPrisma, true),
        ]);
        (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([
            {finishedAt: read2026},
            {finishedAt: read2021},
        ]);
        (prisma.readingChallenge.findMany as jest.Mock).mockResolvedValue([{year: 2026}]);
    });

    test('should include the type of every bookshelf', async () => {
        const {bookshelves} = await getStatus();

        expect(bookshelves.map(({type}) => type)).toEqual([
            BookshelfType.TO_BE_READ,
            BookshelfType.READ,
        ]);
    });

    test('should return every finish of the book, flagging years with a challenge', async () => {
        const {reads} = await getStatus();

        expect(reads).toEqual([
            {finishedAt: read2026, hasChallenge: true},
            {finishedAt: read2021, hasChallenge: false},
        ]);
    });

    test('should query active finishes newest first, and challenges for their UTC years', async () => {
        await getStatus();

        expect(prisma.readingSession.findMany).toHaveBeenCalledWith({
            where: {
                userId,
                bookId: bookPrisma.id,
                finishedAt: {not: null},
                deletedAt: null,
            },
            orderBy: {finishedAt: 'desc'},
            select: {finishedAt: true},
        });
        expect(prisma.readingChallenge.findMany).toHaveBeenCalledWith({
            where: {userId, year: {in: [2026, 2021]}},
            select: {year: true},
        });
    });

    test('should return the reads whatever shelf the book is on', async () => {
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook(bookshelfPrisma, true),
            withBook(readBookshelfPrisma, false),
        ]);

        const {reads} = await getStatus();

        expect(reads).toHaveLength(2);
    });

    test('should return no reads, and skip the challenge lookup, when never finished', async () => {
        (prisma.readingSession.findMany as jest.Mock).mockResolvedValue([]);

        const {reads} = await getStatus();

        expect(reads).toEqual([]);
        expect(prisma.readingChallenge.findMany).not.toHaveBeenCalled();
    });

    test('should not look up reads when the book is not in the database', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            {...readBookshelfPrisma, _count: {books: 0}},
        ]);

        const {reads} = await getStatus();

        expect(reads).toEqual([]);
        expect(prisma.readingSession.findMany).not.toHaveBeenCalled();
    });
});
