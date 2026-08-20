import {prisma} from '@tests/setup';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {bookshelfBookPrisma, readBookshelfPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookDatasourceImpl.finishReadingProgress tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should force readingProgress to 100 and currentPage to totalPages, and move to the Read bookshelf', async () => {
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            bookshelfId: readBookshelfPrisma.id,
            readingProgress: 100,
            currentPage: bookshelfBookPrisma.totalPages,
        });

        const result = await datasourceImpl.finishReadingProgress(
            bookshelfBookPrisma.id,
            readBookshelfPrisma.id
        );

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.$transaction).toHaveBeenCalled();
        expect(prisma.bookshelfBook.findUnique).toHaveBeenCalledWith({
            where: {id: bookshelfBookPrisma.id},
        });
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            where: {id: bookshelfBookPrisma.id},
            data: {
                bookshelfId: readBookshelfPrisma.id,
                readingProgress: 100,
                currentPage: bookshelfBookPrisma.totalPages,
            },
        });
    });

    test('should force readingProgress to 100 even when the book is already on the target bookshelf', async () => {
        const sameShelfBook = {
            ...bookshelfBookPrisma,
            bookshelfId: readBookshelfPrisma.id,
        };
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            sameShelfBook
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...sameShelfBook,
            readingProgress: 100,
            currentPage: sameShelfBook.totalPages,
        });

        await datasourceImpl.finishReadingProgress(
            bookshelfBookPrisma.id,
            readBookshelfPrisma.id
        );

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            where: {id: bookshelfBookPrisma.id},
            data: {
                bookshelfId: readBookshelfPrisma.id,
                readingProgress: 100,
                currentPage: sameShelfBook.totalPages,
            },
        });
    });

    test('should throw a NOT_FOUND error when the bookshelf book does not exist', async () => {
        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(
            datasourceImpl.finishReadingProgress(
                bookshelfBookPrisma.id,
                readBookshelfPrisma.id
            )
        ).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_READING_PROGRESS.NOT_FOUND
            )
        );
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });
});
