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

        const result = await datasourceImpl.addToBookshelf(dto as AddToBookshelfDto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.findFirst).toHaveBeenCalledWith({
            where: {bookshelfId: (dto as AddToBookshelfDto).bookshelfId, bookId: 0},
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

        await datasourceImpl.addToBookshelf(dto as AddToBookshelfDto);

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

        await datasourceImpl.addToBookshelf(dto as AddToBookshelfDto);

        expect(prisma.bookshelfBook.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                readingProgress: 0,
                totalPages: null,
            }),
        });
    });

    test('should restore a soft-deleted book and return a BookshelfBookEntity', async () => {
        const softDeletedBook = {...bookshelfBookPrisma, deletedAt: new Date()};
        const restoredBook = {...bookshelfBookPrisma, deletedAt: null};
        const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(softDeletedBook);
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(restoredBook);

        const result = await datasourceImpl.addToBookshelf(dto as AddToBookshelfDto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            where: {id: softDeletedBook.id},
            data: expect.objectContaining({deletedAt: null}),
        });
        expect(prisma.bookshelfBook.create).not.toHaveBeenCalled();
    });

    test('should throw an error when bookshelf book already exists', async () => {
        const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

        (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(
            bookshelfBookPrisma
        );

        await expect(
            datasourceImpl.addToBookshelf(dto as AddToBookshelfDto)
        ).rejects.toThrow(
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

            await expect(
                datasourceImpl.addToBookshelf(dto as AddToBookshelfDto)
            ).rejects.toThrow('DB connection failed');

            expect(prisma.bookshelfBook.create).not.toHaveBeenCalled();
        });
        test('should throw an error when prisma.create rejects', async () => {
            const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

            (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.bookshelfBook.create as jest.Mock).mockRejectedValue(
                new Error('DB connection failed')
            );

            await expect(
                datasourceImpl.addToBookshelf(dto as AddToBookshelfDto)
            ).rejects.toThrow('DB connection failed');

            expect(prisma.bookshelfBook.findFirst).toHaveBeenCalled();
            expect(prisma.bookshelfBook.create).toHaveBeenCalled();
        });
        test('should throw an error when prisma.update rejects during soft-delete restore', async () => {
            const softDeletedBook = {...bookshelfBookPrisma, deletedAt: new Date()};
            const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

            (prisma.bookshelfBook.findFirst as jest.Mock).mockResolvedValue(
                softDeletedBook
            );
            (prisma.bookshelfBook.update as jest.Mock).mockRejectedValue(
                new Error('DB connection failed')
            );

            await expect(
                datasourceImpl.addToBookshelf(dto as AddToBookshelfDto)
            ).rejects.toThrow('DB connection failed');

            expect(prisma.bookshelfBook.update).toHaveBeenCalled();
            expect(prisma.bookshelfBook.create).not.toHaveBeenCalled();
        });
    });
});
