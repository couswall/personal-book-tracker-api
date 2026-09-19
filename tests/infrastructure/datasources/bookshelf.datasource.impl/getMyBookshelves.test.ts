import {prisma} from '@data/postgres';
import {BookshelfEntity} from '@domain/entities';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {bookshelfObj, bookshelfPrisma} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        bookshelf: {
            findMany: jest.fn(),
        },
    },
}));

describe('BookshelfDatasourceImpl.getMyBookshelves', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();

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
