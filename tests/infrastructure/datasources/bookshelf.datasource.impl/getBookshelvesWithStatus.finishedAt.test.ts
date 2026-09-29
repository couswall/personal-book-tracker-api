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

describe('BookshelfDatasourceImpl.getBookshelvesWithStatus type and finishedAt', () => {
    const datasource = new BookshelfDatasourceImpl();
    const {userId} = bookshelfObj;
    const apiBookId = 'abc123';
    const bookPrisma = {id: 7};
    const finishedAt = new Date('2026-03-15T00:00:00Z');

    const withBook = (shelf: {id: number; type: BookshelfType}, hasBook: boolean) => ({
        ...shelf,
        _count: {books: 1},
        books: hasBook
            ? [{id: 101, readingProgress: 100, currentPage: 300, progressType: null}]
            : [],
    });

    const getStatus = () => datasource.getBookshelvesWithStatus(userId, apiBookId);

    beforeEach(() => {
        jest.clearAllMocks();
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue({finishedAt});
    });

    test('should include the type of every bookshelf', async () => {
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook(bookshelfPrisma, false),
            withBook(readBookshelfPrisma, false),
        ]);

        const result = await getStatus();

        expect(result.map(({type}) => type)).toEqual([
            BookshelfType.TO_BE_READ,
            BookshelfType.READ,
        ]);
    });

    test('should return the latest finish date on the READ shelf holding the book', async () => {
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook(bookshelfPrisma, false),
            withBook(readBookshelfPrisma, true),
        ]);

        const result = await getStatus();

        expect(prisma.readingSession.findFirst).toHaveBeenCalledWith({
            where: {
                userId,
                bookId: bookPrisma.id,
                finishedAt: {not: null},
                deletedAt: null,
            },
            orderBy: {finishedAt: 'desc'},
            select: {finishedAt: true},
        });
        expect(result[0].finishedAt).toBeNull();
        expect(result[1].finishedAt).toEqual(finishedAt);
    });

    test('should return null finishedAt on the READ shelf when the finish date is unknown', async () => {
        (prisma.readingSession.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook(readBookshelfPrisma, true),
        ]);

        const [readShelf] = await getStatus();

        expect(readShelf.isSelected).toBe(true);
        expect(readShelf.finishedAt).toBeNull();
    });

    test('should not expose finishedAt on shelves other than READ', async () => {
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            withBook({...bookshelfPrisma, type: BookshelfType.CURRENTLY_READING}, true),
        ]);

        const [shelf] = await getStatus();

        expect(shelf.finishedAt).toBeNull();
    });

    test('should not look up reading sessions when the book is not in the database', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            {...readBookshelfPrisma, _count: {books: 0}},
        ]);

        const [shelf] = await getStatus();

        expect(prisma.readingSession.findFirst).not.toHaveBeenCalled();
        expect(shelf.finishedAt).toBeNull();
    });
});
