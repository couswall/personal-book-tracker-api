import {prisma} from '@tests/setup';
import {Prisma} from '@/generated/prisma';
import {UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';
import {CustomError} from '@domain/errors/custom.error';
import {bookshelfBookPrisma, updateBookshelfDtoObject} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookDatasourceImpl.updateBookshelf error handling tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should throw an error when bookshelf book is not found', async () => {
        const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(datasourceImpl.updateBookshelf(dto)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_BOOKSHELF.NOT_FOUND
            )
        );

        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });

    test('should throw an error when prisma.bookshelfBook.findUnique rejects', async () => {
        const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockRejectedValue(
            new Error('DB connection failed')
        );

        await expect(datasourceImpl.updateBookshelf(dto)).rejects.toThrow(
            'DB connection failed'
        );

        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });

    test('should throw an error when prisma.bookshelfBook.update rejects', async () => {
        const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockRejectedValue(
            new Error('DB update failed')
        );

        await expect(datasourceImpl.updateBookshelf(dto)).rejects.toThrow(
            'DB update failed'
        );

        expect(prisma.bookshelfBook.findUnique).toHaveBeenCalled();
        expect(prisma.bookshelfBook.update).toHaveBeenCalled();
    });

    test('should throw a NOT_FOUND CustomError when prisma.bookshelfBook.update rejects with P2025', async () => {
        const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError('Record not found', {
                code: 'P2025',
                clientVersion: '0.0.0',
            })
        );

        await expect(datasourceImpl.updateBookshelf(dto)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_BOOKSHELF.NOT_FOUND
            )
        );
    });
});
