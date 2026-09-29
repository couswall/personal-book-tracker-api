import {prisma} from '@data/postgres';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {bookshelfCount} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        bookshelf: {
            findMany: jest.fn(),
        },
    },
}));

describe('BookshelfDatasourceImpl.getBookshelfCounts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();
    const {id, name, type, bookCount} = bookshelfCount;

    test('should return each shelf with its book count', async () => {
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
            {id, name, type, _count: {books: bookCount}},
        ]);

        const result = await bookshelfDatasourceImpl.getBookshelfCounts(1);

        expect(result).toEqual([bookshelfCount]);
        expect(prisma.bookshelf.findMany).toHaveBeenCalledWith({
            where: {userId: 1, deletedAt: null},
            orderBy: {id: 'asc'},
            select: {
                id: true,
                name: true,
                type: true,
                _count: {select: {books: true}},
            },
        });
    });

    test('should return an empty array when the user has no shelves', async () => {
        (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([]);

        const result = await bookshelfDatasourceImpl.getBookshelfCounts(1);

        expect(result).toEqual([]);
    });
});
