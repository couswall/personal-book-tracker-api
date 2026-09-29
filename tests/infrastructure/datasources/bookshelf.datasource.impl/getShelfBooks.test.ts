import {prisma} from '@data/postgres';
import {BookshelfType} from '@/generated/prisma';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {shelfBook} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        bookshelfBook: {
            findMany: jest.fn(),
        },
    },
}));

describe('BookshelfDatasourceImpl.getShelfBooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();
    const shelfBookRow = {
        id: shelfBook.bookshelfBookId,
        bookshelfId: 3,
        bookId: 7,
        readingProgress: shelfBook.readingProgress,
        currentPage: shelfBook.currentPage,
        totalPages: shelfBook.totalPages,
        progressType: shelfBook.progressType,
        createdAt: new Date(),
        updatedAt: new Date(),
        book: {
            apiBookId: shelfBook.apiBookId,
            title: shelfBook.title,
            authors: shelfBook.authors,
            coverImageUrl: shelfBook.coverImageUrl,
        },
    };

    test('should return the most recently updated books of that shelf type', async () => {
        (prisma.bookshelfBook.findMany as jest.Mock).mockResolvedValue([shelfBookRow]);

        const result = await bookshelfDatasourceImpl.getShelfBooks(
            1,
            BookshelfType.CURRENTLY_READING,
            3
        );

        expect(result).toEqual([shelfBook]);
        expect(prisma.bookshelfBook.findMany).toHaveBeenCalledWith({
            where: {
                bookshelf: {
                    userId: 1,
                    type: BookshelfType.CURRENTLY_READING,
                    deletedAt: null,
                },
            },
            orderBy: [{updatedAt: 'desc'}, {id: 'desc'}],
            take: 3,
            include: {
                book: {
                    select: {
                        apiBookId: true,
                        title: true,
                        authors: true,
                        coverImageUrl: true,
                    },
                },
            },
        });
    });

    test('should return an empty array when the shelf is empty', async () => {
        (prisma.bookshelfBook.findMany as jest.Mock).mockResolvedValue([]);

        const result = await bookshelfDatasourceImpl.getShelfBooks(
            1,
            BookshelfType.TO_BE_READ,
            8
        );

        expect(result).toEqual([]);
    });
});
