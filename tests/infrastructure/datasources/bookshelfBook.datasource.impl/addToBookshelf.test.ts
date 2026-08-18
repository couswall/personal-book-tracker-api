import {prisma} from '@tests/setup';
import {BookshelfType, Prisma} from '@/generated/prisma';
import {CustomError} from '@domain/errors/custom.error';
import {AddToBookshelfDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {addToBookshelfDtoObject, bookshelfBookPrisma} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('BookshelfBookDatasourceImpl.addToBookshelf tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    const buildDto = (overrides = {}) => {
        const [, dto] = AddToBookshelfDto.create({
            ...addToBookshelfDtoObject,
            ...overrides,
        });
        const addToBookshelfDto = dto as AddToBookshelfDto;
        addToBookshelfDto.bookId = bookshelfBookPrisma.bookId;
        return addToBookshelfDto;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a BookshelfBookEntity when adding is successful', async () => {
        const dto = buildDto();

        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        const result = await datasourceImpl.addToBookshelf(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                bookshelfId: dto.bookshelfId,
                bookId: dto.bookId,
            }),
        });
    });

    test('should set readingProgress to 100 for READ bookshelf type', async () => {
        const dto = buildDto({bookshelfType: BookshelfType.READ});

        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.addToBookshelf(dto);

        expect(prisma.bookshelfBook.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                readingProgress: 100,
            }),
        });
    });

    test('should handle default values correctly when not provided in DTO', async () => {
        const dto = buildDto();

        (prisma.bookshelfBook.create as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.addToBookshelf(dto);

        expect(prisma.bookshelfBook.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                readingProgress: 0,
                totalPages: null,
            }),
        });
    });

    test('should throw an error when bookId is missing', async () => {
        const [, dto] = AddToBookshelfDto.create(addToBookshelfDtoObject);

        await expect(
            datasourceImpl.addToBookshelf(dto as AddToBookshelfDto)
        ).rejects.toThrow('bookId is required');

        expect(prisma.bookshelfBook.create).not.toHaveBeenCalled();
    });

    test('should throw an error when bookshelf book already exists', async () => {
        const dto = buildDto();

        (prisma.bookshelfBook.create as jest.Mock).mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
                code: 'P2002',
                clientVersion: '0.0.0',
            })
        );

        await expect(datasourceImpl.addToBookshelf(dto)).rejects.toThrow(
            CustomError.badRequest(
                ERROR_MESSAGES.BOOKSHELF_BOOK.ADD_TO_BOOKSHELF.ALREADY_ADDED
            )
        );
    });

    describe('Error handling for prisma calls', () => {
        test('should rethrow the original error when prisma.create rejects with a non-P2002 error', async () => {
            const dto = buildDto();

            (prisma.bookshelfBook.create as jest.Mock).mockRejectedValue(
                new Error('DB connection failed')
            );

            await expect(datasourceImpl.addToBookshelf(dto)).rejects.toThrow(
                'DB connection failed'
            );

            expect(prisma.bookshelfBook.create).toHaveBeenCalled();
        });
    });
});
