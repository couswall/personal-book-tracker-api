import { prisma } from "@tests/setup/prisma.mock";
import { createBookDatasource } from "@tests/infrastructure/datasources/book.datasource.impl/setup";
import { CreateBookDto } from "@domain/dtos";
import { createBookDtoObj, mockBookPrisma} from "@tests/fixtures";
import { BookEntity } from "@domain/entities/book.entity";
import { CustomError } from "@domain/errors/custom.error";
import { ERROR_MESSAGES } from "@infrastructure/constants";

describe("BookDatasourceImpl.fetchByIdFromAPI", () => {
    const {bookDatasourceImpl} = createBookDatasource();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return a BookEntity when creating is successful", async () => {
        const [,dto] = CreateBookDto.create(createBookDtoObj);

        (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.book.create as jest.Mock).mockResolvedValue(mockBookPrisma);
        const result = await bookDatasourceImpl.create(dto!);

        expect(result).toBeInstanceOf(BookEntity);
        expect(prisma.book.findUnique).toHaveBeenCalledWith({
            where: {apiBookId: dto!.apiBookId, deletedAt: null}
        });
    });
    test("should throw an error if book already exists", async () => {
        const [,dto] = CreateBookDto.create(createBookDtoObj);

        (prisma.book.findUnique as jest.Mock).mockResolvedValue(mockBookPrisma);

        await expect(bookDatasourceImpl.create(dto!)).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.BOOK.CREATE.EXISTING)
        );
    });
    describe('Error handling for prisma calls', () => {
        test("should throw an error when prisma.findUnique rejects", async () => {
            const [,dto] = CreateBookDto.create(createBookDtoObj);
        
            (prisma.book.findUnique as jest.Mock).mockRejectedValue(new Error("DB connection failed"));
        
            await expect(bookDatasourceImpl.create(dto!)).rejects.toThrow("DB connection failed");
        
            expect(prisma.book.create).not.toHaveBeenCalled();
        });
        test("should throw an error when prisma.create rejects", async () => {
            const [,dto] = CreateBookDto.create(createBookDtoObj);
        
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.book.create as jest.Mock).mockRejectedValue(new Error("DB connection failed"));
        
            await expect(bookDatasourceImpl.create(dto!)).rejects.toThrow("DB connection failed");
            
            expect(prisma.book.findUnique).toHaveBeenCalled();
            expect(prisma.book.create).toHaveBeenCalled();
        });
    });
});
