import {prisma} from '@tests/setup';
import {BookshelfType} from '@prisma/client';
import {UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {bookshelfBookPrisma, updateBookshelfDtoObject} from '@tests/fixtures';
import {CustomError} from '@/src/domain/errors/custom.error';
import {ERROR_MESSAGES} from '@/src/infrastructure/constants';

describe('BookshelfBookDatasourceImpl.updateBookshelf tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a BookshelfBookEntity when updating bookshelf is successful', async () => {
        const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);
        const updatedBookshelfBook = {
            ...bookshelfBookPrisma,
            bookshelfId: dto!.bookshelfId,
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(
            updatedBookshelfBook
        );

        const result = await datasourceImpl.updateBookshelf(dto!);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.findUnique).toHaveBeenCalledWith({
            where: {id: dto!.bookshelfBookId},
        });
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto!.bookshelfId,
                readingProgress: bookshelfBookPrisma.readingProgress,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });
    test('should set readingProgress to 100 when bookshelfType is READ', async () => {
        const dto = new UpdateBookshelfDto(1, 1, BookshelfType.READ);
        const updatedBookshelfBook = {
            ...bookshelfBookPrisma,
            bookshelfId: dto.bookshelfId,
            readingProgress: 100,
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(
            updatedBookshelfBook
        );

        const result = await datasourceImpl.updateBookshelf(dto!);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto.bookshelfId,
                readingProgress: 100,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });
    test('should maintain existing readingProgress when bookshelfType is not READ', async () => {
        const dto = new UpdateBookshelfDto(1, 1, BookshelfType.CUSTOM);

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            bookshelfId: dto.bookshelfId,
        });

        await datasourceImpl.updateBookshelf(dto!);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto!.bookshelfId,
                readingProgress: bookshelfBookPrisma.readingProgress,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });
    test('should return existing book without update when bookshelfId is the same', async () => {
        const dto = new UpdateBookshelfDto(1, bookshelfBookPrisma.bookshelfId);

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );

        const result = await datasourceImpl.updateBookshelf(dto!);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result.bookshelfId).toBe(bookshelfBookPrisma.bookshelfId);
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });
    test('should handle empty bookshelfType correctly (maintain existing progress)', async () => {
        const [, dto] = UpdateBookshelfDto.create({
            ...updateBookshelfDtoObject,
            bookshelfType: undefined,
        });

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            bookshelfId: dto!.bookshelfId,
        });

        await datasourceImpl.updateBookshelf(dto!);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto!.bookshelfId,
                readingProgress: bookshelfBookPrisma.readingProgress,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });
    test('should throw an error when bookshelf book is not found', async () => {
        const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(datasourceImpl.updateBookshelf(dto!)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.UPDATE_BOOKSHELF.NOT_FOUND
            )
        );

        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });
    describe('Error handling for prisma calls', () => {
        test('should throw an error when prisma.bookshelfBook.findUnique rejects', async () => {
            const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);

            (prisma.bookshelfBook.findUnique as jest.Mock).mockRejectedValue(
                new Error('DB connection failed')
            );

            await expect(datasourceImpl.updateBookshelf(dto!)).rejects.toThrow(
                'DB connection failed'
            );

            expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
        });

        test('should throw an error when prisma.bookshelfBook.update rejects', async () => {
            const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);

            (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValue(
                bookshelfBookPrisma
            );
            (prisma.bookshelfBook.update as jest.Mock).mockRejectedValue(
                new Error('DB update failed')
            );

            await expect(datasourceImpl.updateBookshelf(dto!)).rejects.toThrow(
                'DB update failed'
            );

            expect(prisma.bookshelfBook.findUnique).toHaveBeenCalled();
            expect(prisma.bookshelfBook.update).toHaveBeenCalled();
        });
    });
});
