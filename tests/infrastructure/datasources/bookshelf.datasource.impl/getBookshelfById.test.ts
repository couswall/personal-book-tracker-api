import {prisma} from '@data/postgres';
import {BookshelfEntity} from '@domain/entities';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {bookshelfObj, bookshelfPrisma} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        bookshelf: {
            findUnique: jest.fn(),
        },
    },
}));

describe('BookshelfDatasourceImpl.getBookshelfById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();

    test('should return a BookshelfEntity when getting successfully', async () => {
        (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);

        const result = await bookshelfDatasourceImpl.getBookshelfById(bookshelfObj.id);

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
