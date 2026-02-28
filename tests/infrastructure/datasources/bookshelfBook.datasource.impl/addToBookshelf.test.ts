import {prisma} from '@tests/setup';
import {BookshelfType} from '@prisma/client';
import {CustomError} from '@domain/errors/custom.error';
import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {addToBookshelfDtoObject, bookshelfBookPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookDatasourceImpl.addToBookshelf tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a BookshelfBookEntity when adding is successful', async () => {
        const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        const result = await datasourceImpl.addToBookshelf(dto!);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.findFirst).toHaveBeenCalledWith({
            where: {bookshelfId: dto!.bookshelfId, bookId: 0, deletedAt: null},
        });
    });

    test('should set readingProgress to 100 for READ bookshelf type', async () => {
        const readDtoData = {
            ...addToBookshelfDtoObject,
            bookshelfType: BookshelfType.READ,
        };
        const [, dto] = AddToBookshelfDto.create(readDtoData);

        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.addToBookshelf(dto!);

        expect(prisma.bookshelfBook.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                readingProgress: 100,
            }),
        });
    });
    test('should handle default values correctly when not provided in DTO', async () => {
        const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.addToBookshelf(dto!);

        expect(prisma.bookshelfBook.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                readingProgress: 0,
                totalPages: null,
            }),
        });
    });

    test('should throw an error when bookshelf book already exists', async () => {
        const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );

        await expect(datasourceImpl.addToBookshelf(dto!)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.ADD_TO_BOOKSHELF.ALREADY_ADDED
            )
        );
    });

    describe('Error handling for prisma calls', () => {
        test('should throw an error when prisma.bookshelfBook.findFirst rejects', async () => {
            const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

            (prisma.bookshelfBook.findFirst as jest.Mock).mockRejectedValue(
                new Error('DB connection failed')
            );

            await expect(datasourceImpl.addToBookshelf(dto!)).rejects.toThrow(
                'DB connection failed'
            );

            expect(prisma.bookshelfBook.create).not.toHaveBeenCalled();
        });
        test('should throw an error when prisma.create rejects', async () => {
            const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

            (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.bookshelfBook.create as jest.Mock).mockRejectedValue(
                new Error('DB connection failed')
            );

            await expect(datasourceImpl.addToBookshelf(dto!)).rejects.toThrow(
                'DB connection failed'
            );

            expect(prisma.bookshelfBook.findFirst).toHaveBeenCalled();
            expect(prisma.bookshelfBook.create).toHaveBeenCalled();
        });
    });
});
