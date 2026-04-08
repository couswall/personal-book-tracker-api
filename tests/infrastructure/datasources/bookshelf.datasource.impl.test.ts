import {prisma} from '@data/postgres';
import {BookshelfEntity} from '@domain/entities';
import {CreateCustomBookShelfDto} from '@domain/dtos';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {
    bookshelfObj,
    bookshelfPrisma,
    bookshelfWithStatus,
    createCustomBookshelfDto,
} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        book: {
            findUnique: jest.fn(),
        },
        bookshelf: {
            create: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
    },
}));

describe('bookshelf.datasource.impl tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();

    describe('createCustom()', () => {
        test('should return a BookEntity when created successfully', async () => {
            const {userId, shelfName} = createCustomBookshelfDto;
            const [, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

            (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.bookshelf.create as jest.Mock).mockResolvedValue(bookshelfPrisma);

            const result = await bookshelfDatasourceImpl.createCustom(
                dto as CreateCustomBookShelfDto
            );

            expect(result).toBeInstanceOf(BookshelfEntity);
            expect(prisma.bookshelf.findFirst).toHaveBeenCalledWith({
                where: {userId, name: shelfName, deletedAt: null},
            });
            expect(prisma.bookshelf.create).toHaveBeenCalled();
        });
        test('should throw a 400 error when book with provided name already exists', async () => {
            const [, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

            (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(bookshelfPrisma);

            await expect(
                bookshelfDatasourceImpl.createCustom(dto as CreateCustomBookShelfDto)
            ).rejects.toThrow(
                CustomError.badRequest(ERROR_MESSAGES.BOOKSHELF.CREATE_CUSTOM.EXISTING)
            );
        });
    });

    describe('getMyBookshelves()', () => {
        test('should return an array of BookshelfEntity instances', async () => {
            const {userId} = createCustomBookshelfDto;

            (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([bookshelfPrisma]);

            const result = await bookshelfDatasourceImpl.getMyBookshelves(userId);

            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0]).toBeInstanceOf(BookshelfEntity);
            expect(prisma.bookshelf.findMany).toHaveBeenCalledWith({
                where: {userId, deletedAt: null},
            });
        });
    });

    describe('getBookshelfById() tests', () => {
        test('should return a BookshelfEntity when getting successfully', async () => {
            (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);

            const result = await bookshelfDatasourceImpl.getBookshelfById(
                bookshelfObj.id
            );

            expect(result).toBeInstanceOf(BookshelfEntity);
            expect(prisma.bookshelf.findUnique).toHaveBeenCalled();
        });
        test('should throw a 400 error if bookshelf book does not exist', async () => {
            (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(
                bookshelfDatasourceImpl.getBookshelfById(bookshelfObj.id)
            ).rejects.toThrow(ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND);
        });
    });

    describe('getBookshelvesWithStatus()', () => {
        const {userId} = bookshelfObj;
        const apiBookId = 'abc123';
        const bookPrisma = {id: 1};
        const bookshelfPrismaWithIncludes = {
            ...bookshelfPrisma,
            _count: {books: bookshelfWithStatus.bookCount},
            books: [{id: bookshelfWithStatus.bookshelfBookId}],
        };

        test('should return bookshelves with isSelected=true when book exists and is in a shelf', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
            (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
                bookshelfPrismaWithIncludes,
            ]);

            const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
                userId,
                apiBookId
            );

            expect(Array.isArray(result)).toBeTruthy();
            expect(result[0].isSelected).toBe(true);
            expect(result[0].bookshelfBookId).toBe(bookshelfWithStatus.bookshelfBookId);
            expect(result[0].bookCount).toBe(bookshelfWithStatus.bookCount);
            expect(result[0].isCustom).toBe(false);
            expect(prisma.book.findUnique).toHaveBeenCalledWith({
                where: {apiBookId},
                select: {id: true},
            });
        });

        test('should return bookshelves with isSelected=false and bookshelfBookId=null when book is not in any shelf', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
            (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
                {...bookshelfPrismaWithIncludes, books: []},
            ]);

            const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
                userId,
                apiBookId
            );

            expect(result[0].isSelected).toBe(false);
            expect(result[0].bookshelfBookId).toBeNull();
        });

        test('should return all isSelected=false when book does not exist in the DB', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([
                {...bookshelfPrisma, _count: {books: 2}},
            ]);

            const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
                userId,
                apiBookId
            );

            expect(result[0].isSelected).toBe(false);
            expect(result[0].bookshelfBookId).toBeNull();
        });

        test('should return an empty array when user has no bookshelves', async () => {
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(bookPrisma);
            (prisma.bookshelf.findMany as jest.Mock).mockResolvedValue([]);

            const result = await bookshelfDatasourceImpl.getBookshelvesWithStatus(
                userId,
                apiBookId
            );

            expect(result).toEqual([]);
        });
    });
});
