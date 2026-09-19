import {prisma} from '@tests/setup';
import {BookshelfType} from '@/generated/prisma';
import {UpdateBookshelfDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {bookshelfBookPrisma, updateBookshelfDtoObject} from '@tests/fixtures';

describe('BookshelfBookDatasourceImpl.updateBookshelf tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a BookshelfBookEntity when updating bookshelf is successful', async () => {
        const [, dto] = UpdateBookshelfDto.create(updateBookshelfDtoObject);
        if (!dto) throw new Error();

        const updatedBookshelfBook = {
            ...bookshelfBookPrisma,
            bookshelfId: dto.bookshelfId,
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(
            updatedBookshelfBook
        );

        const result = await datasourceImpl.updateBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.findUnique).toHaveBeenCalledWith({
            where: {id: dto.bookshelfBookId},
        });
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto.bookshelfId,
                readingProgress: bookshelfBookPrisma.readingProgress,
                currentPage: bookshelfBookPrisma.currentPage,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should set readingProgress to 100 and currentPage to totalPages when bookshelfType is READ', async () => {
        const dto = new UpdateBookshelfDto(1, 1, BookshelfType.READ);
        const updatedBookshelfBook = {
            ...bookshelfBookPrisma,
            bookshelfId: dto.bookshelfId,
            readingProgress: 100,
            currentPage: bookshelfBookPrisma.totalPages,
        };

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(
            updatedBookshelfBook
        );

        const result = await datasourceImpl.updateBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto.bookshelfId,
                readingProgress: 100,
                currentPage: bookshelfBookPrisma.totalPages,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should reset readingProgress and currentPage to 0 when bookshelfType is CURRENTLY_READING', async () => {
        const dto = new UpdateBookshelfDto(1, 1, BookshelfType.CURRENTLY_READING);

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            bookshelfId: dto.bookshelfId,
            readingProgress: 0,
            currentPage: 0,
        });

        await datasourceImpl.updateBookshelf(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto.bookshelfId,
                readingProgress: 0,
                currentPage: 0,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should maintain existing readingProgress and currentPage when bookshelfType is not READ or CURRENTLY_READING', async () => {
        const dto = new UpdateBookshelfDto(1, 1, BookshelfType.TO_BE_READ);

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            bookshelfId: dto.bookshelfId,
        });

        await datasourceImpl.updateBookshelf(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto.bookshelfId,
                readingProgress: bookshelfBookPrisma.readingProgress,
                currentPage: bookshelfBookPrisma.currentPage,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should return existing book without update when bookshelfId is the same', async () => {
        const dto = new UpdateBookshelfDto(1, bookshelfBookPrisma.bookshelfId);

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );

        const result = await datasourceImpl.updateBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(result.bookshelfId).toBe(bookshelfBookPrisma.bookshelfId);
        expect(prisma.bookshelfBook.update).not.toHaveBeenCalled();
    });

    test('should handle empty bookshelfType correctly (maintain existing progress)', async () => {
        const [, dto] = UpdateBookshelfDto.create({
            ...updateBookshelfDtoObject,
            bookshelfType: undefined,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            bookshelfId: dto.bookshelfId,
        });

        await datasourceImpl.updateBookshelf(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                bookshelfId: dto.bookshelfId,
                readingProgress: bookshelfBookPrisma.readingProgress,
                currentPage: bookshelfBookPrisma.currentPage,
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });
});
