import {prisma} from '@data/postgres';
import {BookshelfType} from '@/generated/prisma';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {bookshelfObj, bookshelfPrisma, bookshelfWithStatus} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        book: {
            findUnique: jest.fn(),
        },
        bookshelf: {
            findMany: jest.fn(),
        },
    },
}));

describe('BookshelfDatasourceImpl.getBookshelvesWithStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();

    const {userId} = bookshelfObj;
    const apiBookId = 'abc123';
    const bookPrisma = {id: 1};
    const bookshelfPrismaWithIncludes = {
        ...bookshelfPrisma,
        _count: {books: bookshelfWithStatus.bookCount},
        books: [
            {
                id: bookshelfWithStatus.bookshelfBookId,
                readingProgress: null,
                currentPage: null,
            },
        ],
    };
    const bookshelfPrismaCurrentlyReading = {
        ...bookshelfPrisma,
        type: BookshelfType.CURRENTLY_READING,
        _count: {books: bookshelfWithStatus.bookCount},
        books: [
            {
                id: bookshelfWithStatus.bookshelfBookId,
                readingProgress: 50,
                currentPage: 120,
                progressType: 'PAGE',
            },
        ],
    };

    test('should return bookshelves with isSelected=true when book exists and is in a shelf', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            bookshelfPrismaWithIncludes,
        ]);

        const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
            userId,
            apiBookId
        );

        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0].isSelected).toBe(true);
        expect(result[0].bookshelfBookId).toBe(bookshelfWithStatus.bookshelfBookId);
        expect(result[0].bookCount).toBe(bookshelfWithStatus.bookCount);
        expect(result[0].readingProgress).toBeNull();
        expect(result[0].currentPage).toBeNull();
        expect(prisma.book.findUnique).toHaveBeenCalledWith({
            where: {apiBookId},
            select: {id: true},
        });
    });

    test('should return readingProgress and currentPage when book is in a CURRENTLY_READING shelf', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            bookshelfPrismaCurrentlyReading,
        ]);

        const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
            userId,
            apiBookId
        );

        expect(result[0].isSelected).toBe(true);
        expect(result[0].readingProgress).toBe(50);
        expect(result[0].currentPage).toBe(120);
        expect(result[0].progressType).toBe('PAGE');
    });

    test('should return null readingProgress and currentPage when book is not in a CURRENTLY_READING shelf', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            {...bookshelfPrismaCurrentlyReading, books: []},
        ]);

        const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
            userId,
            apiBookId
        );

        expect(result[0].isSelected).toBe(false);
        expect(result[0].readingProgress).toBeNull();
        expect(result[0].currentPage).toBeNull();
    });

    test('should return bookshelves with isSelected=false and bookshelfBookId=null when book is not in any shelf', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            {...bookshelfPrismaWithIncludes, books: []},
        ]);

        const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
            userId,
            apiBookId
        );

        expect(result[0].isSelected).toBe(false);
        expect(result[0].bookshelfBookId).toBeNull();
        expect(result[0].readingProgress).toBeNull();
        expect(result[0].currentPage).toBeNull();
    });

    test('should return all isSelected=false when book does not exist in the DB', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            {...bookshelfPrisma, _count: {books: 2}},
        ]);

        const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
            userId,
            apiBookId
        );

        expect(result[0].isSelected).toBe(false);
        expect(result[0].bookshelfBookId).toBeNull();
        expect(result[0].readingProgress).toBeNull();
        expect(result[0].currentPage).toBeNull();
    });

    test('should return an empty array when user has no bookshelves', async () => {
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([]);

        const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
            userId,
            apiBookId
        );

        expect(result).toEqual([]);
    });
});
