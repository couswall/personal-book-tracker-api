import { prisma } from "@data/postgres";
import { BookshelfEntity } from "@domain/entities";
import { CreateCustomBookShelfDto } from "@domain/dtos";
import { BookshelfDatasourceImpl } from "@infrastructure/datasources/bookshelf.datasource.impl";
import { CustomError } from "@domain/errors/custom.error";
import { ERROR_MESSAGES } from "@infrastructure/constants";
import { bookshelfObj, bookshelfPrisma, createCustomBookshelfDto } from "@tests/fixtures";

jest.mock('@data/postgres', () => ({
    prisma: {
        bookshelf:{
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

            const result = await bookshelfDatasourceImpl.createCustom(dto!);

            expect(result).toBeInstanceOf(BookshelfEntity);
            expect(prisma.bookshelf.findFirst).toHaveBeenCalledWith({
                where: {userId, name: shelfName, deletedAt: null},
            });
            expect(prisma.bookshelf.create).toHaveBeenCalled();
        });
        test('should throw a 400 error when book with provided name already exists', async() => {
            const [, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

            (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(bookshelfPrisma);

            await expect(bookshelfDatasourceImpl.createCustom(dto!)).rejects.toThrow(
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
                where: {userId, deletedAt: null}
            });
        });
    });

    describe('getBookshelfById() tests', () => {
        test('should return a BookshelfEntity when getting successfully', async () => {
            (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(bookshelfPrisma);
            
            const result = await bookshelfDatasourceImpl.getBookshelfById(bookshelfObj.id);
            
            expect(result).toBeInstanceOf(BookshelfEntity);
            expect(prisma.bookshelf.findUnique).toHaveBeenCalled();
        });
        test('should throw a 400 error if bookshelf book does not exist', async () => {
            (prisma.bookshelf.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(bookshelfDatasourceImpl.getBookshelfById(bookshelfObj.id)).rejects.toThrow(
                ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_ID.NOT_FOUND
            );
        });
    });
});