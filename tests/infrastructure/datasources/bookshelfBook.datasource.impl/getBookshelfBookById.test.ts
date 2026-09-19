import {prisma} from '@tests/setup';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {bookshelfBookPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookDatasourceImpl.getBookshelfBookById tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a BookshelfBookEntity when the record exists', async () => {
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );

        const result = await datasourceImpl.getBookshelfBookById(bookshelfBookPrisma.id);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.findUnique).toHaveBeenCalledWith({
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should throw a NOT_FOUND error when the record does not exist', async () => {
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(
            datasourceImpl.getBookshelfBookById(bookshelfBookPrisma.id)
        ).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_READING_PROGRESS.NOT_FOUND
            )
        );
    });
});
