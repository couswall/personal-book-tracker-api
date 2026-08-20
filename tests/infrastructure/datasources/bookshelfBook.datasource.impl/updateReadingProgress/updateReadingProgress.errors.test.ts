import {prisma} from '@tests/setup';
import {Prisma} from '@/generated/prisma';
import {UpdateReadingProgressDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';
import {CustomError} from '@domain/errors/custom.error';
import {bookshelfBookPrisma, updateReadingProgressDtoObject} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookDatasourceImpl.updateReadingProgress error handling tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should throw an error when bookshelf book is not found', async () => {
        const [, dto] = UpdateReadingProgressDto.create(updateReadingProgressDtoObject);
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(null);

        await expect(datasourceImpl.updateReadingProgress(dto)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_READING_PROGRESS.NOT_FOUND
            )
        );
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });

    test('should throw an error when prisma.bookshelfBook.findUnique rejects', async () => {
        const [, dto] = UpdateReadingProgressDto.create(updateReadingProgressDtoObject);
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockRejectedValue(
            new Error('DB connection failed')
        );

        await expect(datasourceImpl.updateReadingProgress(dto)).rejects.toThrow(
            'DB connection failed'
        );
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });

    test('should throw an error when prisma.bookshelfBook.update rejects', async () => {
        const [, dto] = UpdateReadingProgressDto.create(updateReadingProgressDtoObject);
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockRejectedValue(
            new Error('DB update failed')
        );

        await expect(datasourceImpl.updateReadingProgress(dto)).rejects.toThrow(
            'DB update failed'
        );
    });

    test('should throw a NOT_FOUND CustomError when prisma.bookshelfBook.update rejects with P2025', async () => {
        const [, dto] = UpdateReadingProgressDto.create(updateReadingProgressDtoObject);
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

        await expect(datasourceImpl.updateReadingProgress(dto)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_READING_PROGRESS.NOT_FOUND
            )
        );
    });
});
