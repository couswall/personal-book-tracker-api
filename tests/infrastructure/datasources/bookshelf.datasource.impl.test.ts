import {prisma} from '@data/postgres';
import {BookshelfType} from '@/generated/prisma';
import {BookshelfEntity} from '@domain/entities';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {bookshelfObj, bookshelfPrisma, bookshelfWithStatus} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        book: {
            findUnique: jest.fn(),
        },
        bookshelf: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    },
}));

describe('bookshelf.datasource.impl tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();

    describe('getMyBookshelves()', () => {
        test('should return an array of BookshelfEntity instances', async () => {
            const {userId} = bookshelfObj;

            (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([bookshelfPrisma]);

            const result = await bookshelfDatasourceImpl.getMyBookshelves(userId);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toBeInstanceOf(BookshelfEntity);
            expect(prisma.bookshelf.findMany).toHaveBeenCalledWith({
                where: {userId, deletedAt: null},
            });
        });
    });

    describe('getBookshelfById() tests', () => {
        test('should return a BookshelfEntity when getting successfully', async () => {
            (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);

            const result = await bookshelfDatasourceImpl.getBookshelfById(
                bookshelfObj.id
            );

            expect(result).toBeInstanceOf(BookshelfEntity);
            expect(prisma.bookshelf.findUnique).toHaveBeenCalled();
        });
        test('should throw a 400 error if bookshelf book does not exist', async () => {
            (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(
                bookshelfDatasourceImpl.getBookshelfById(bookshelfObj.id)
            ).rejects.toThrow(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND);
        });
    });

    describe('getBookshelvesWithStatus()', () => {
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
});
