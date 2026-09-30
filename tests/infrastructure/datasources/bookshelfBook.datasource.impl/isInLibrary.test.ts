import {prisma} from '@tests/setup';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';

describe('BookshelfBookDatasourceImpl.isInLibrary tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();
    const userId = 1;
    const bookId = 202;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should be true when the book is on one of the user active bookshelves', async () => {
        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValueOnce({id: 101});

        const result = await datasourceImpl.isInLibrary(userId, bookId);

        expect(result).toBe(true);
        expect(prisma.bookshelfBook.findFirst).toHaveBeenCalledWith({
            where: {bookId, bookshelf: {userId, deletedAt: null}},
            select: {id: true},
        });
    });

    test('should be false when the book is on none of the user bookshelves', async () => {
        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValueOnce(null);

        await expect(datasourceImpl.isInLibrary(userId, bookId)).resolves.toBe(false);
    });
});
