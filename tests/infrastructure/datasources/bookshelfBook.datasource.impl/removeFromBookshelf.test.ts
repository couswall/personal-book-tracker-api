import {prisma} from '@tests/setup';
import {RemoveFromBookshelfDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {bookshelfBookPrisma, removeFromBookshelfDtoObject} from '@tests/fixtures';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookDatasourceImpl.removeFromBookshelf tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a BookshelfBookEntity when removal is successful', async () => {
        const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);
        const deletedBookshelfBook = {...bookshelfBookPrisma, deletedAt: new Date()};

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(bookshelfBookPrisma);
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(deletedBookshelfBook);

        const result = await datasourceImpl.removeFromBookshelf(dto!);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.findUnique).toHaveBeenCalledWith({
            where: {id: dto!.bookshelfBookId, deletedAt: null},
        });
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            where: {id: dto!.bookshelfBookId},
            data: {deletedAt: expect.any(Date)},
        });
    });

    test('should throw a 400 error when bookshelf book is not found', async () => {
        const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(datasourceImpl.removeFromBookshelf(dto!)).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF_BOOK.REMOVE_FROM_BOOKSHELF.NOT_FOUND)
        );

        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });

    describe('Error handling for prisma calls', () => {
        test('should throw an error when prisma.bookshelfBook.findUnique rejects', async () => {
            const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);

            (prisma.bookshelfBook.findUnique as jest.Mock).mockRejectedValue(
                new Error('DB connection failed')
            );

            await expect(datasourceImpl.removeFromBookshelf(dto!)).rejects.toThrow(
                'DB connection failed'
            );

            expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
        });

        test('should throw an error when prisma.bookshelfBook.update rejects', async () => {
            const [, dto] = RemoveFromBookshelfDto.create(removeFromBookshelfDtoObject);

            (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(bookshelfBookPrisma);
            (prisma.bookshelfBook.update as jest.Mock).mockRejectedValue(
                new Error('DB update failed')
            );

            await expect(datasourceImpl.removeFromBookshelf(dto!)).rejects.toThrow(
                'DB update failed'
            );

            expect(prisma.bookshelfBook.findUnique).toHaveBeenCalled();
            expect(prisma.bookshelfBook.update).toHaveBeenCalled();
        });
    });
});
