import { prisma } from "@tests/setup/prisma.mock";
import { createBookDatasource } from "@tests/infrastructure/datasources/book.datasource.impl/setup";
import { CreateBookDto } from "@domain/dtos";
import { createBookDtoObj, mockBookPrisma, searchAPIResponseObj} from "@tests/fixtures";
import { BookEntity } from "@domain/entities/book.entity";
import { CustomError } from "@domain/errors/custom.error";
import { ERROR_MESSAGES } from "@infrastructure/constants";
import { AxiosError, InternalAxiosRequestConfig } from "axios";

describe("BookDatasourceImpl.findOrCreateByApiId", () => {
    const {bookDatasourceImpl, mockHttpAdapter} = createBookDatasource();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a BookEntity instance if book already exists in database and provided ID is numeric', async () => {
        const apiBookId = '123';

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);

        const result = await bookDatasourceImpl.findOrCreateByApiId(apiBookId);

        expect(result).toBeInstanceOf(BookEntity);
        expect(prisma.book.findFirst).toHaveBeenCalledWith({
            where: {id: Number(apiBookId), deletedAt: null}
        });
    });

    test('should return a BookEntity instance if book already exists in database with provided apiBookId', async () => {
        const apiBookId = 'abcDh';

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(mockBookPrisma);

        const result = await bookDatasourceImpl.findOrCreateByApiId(apiBookId);

        expect(result).toBeInstanceOf(BookEntity);
        expect(prisma.book.findFirst).toHaveBeenCalledWith({
            where: {apiBookId, deletedAt: null}
        });
    });

    test('should create a new book and return a BookEntity instance if book does not exist in the database', async () => {
        const apiBookId = 'someNonExistingId';
        const mockBookFromApi = searchAPIResponseObj.items[0];
                
        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockResolvedValue(mockBookFromApi);
        (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.book.create as jest.Mock).mockResolvedValue(mockBookPrisma);
        
        const result = await bookDatasourceImpl.findOrCreateByApiId(apiBookId);
        
        expect(result).toBeInstanceOf(BookEntity);
        expect(result.id).not.toBe(0);
         expect(prisma.book.findFirst).toHaveBeenCalledWith({
            where: { apiBookId, deletedAt: null }
        });
        expect(mockHttpAdapter.get).toHaveBeenCalledWith(
            expect.stringContaining(`/volumes/${apiBookId}`)
        );
        expect(prisma.book.create).toHaveBeenCalledWith({
            data: expect.any(CreateBookDto)
        });
    });
    test('should throw an error when CreateBookDto return an error', async () => {
        const apiBookId = 'minimalDataId';
        const minimalApiResponse = {
            ...searchAPIResponseObj.items[0], 
            volumeInfo: {
                ...searchAPIResponseObj.items[0].volumeInfo,
                title: 'Minimal title',
                subtitle: 'ab',
            }
        };

        (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
        mockHttpAdapter.get.mockResolvedValue(minimalApiResponse);
        
        await expect(bookDatasourceImpl.findOrCreateByApiId(apiBookId)).rejects.toThrow(
            'subtitle must contain at least 3 characters long'
        );
    });
    describe('Error handling for external API calls', () => {
        test('should throw CustomError when external API returns 503 error', async() => {
            const apiBookId = 'invalidId';
            const axiosError = new AxiosError("Service unavailable", "503", {} as InternalAxiosRequestConfig, null, {
                data: { error: { code: 503 } },
                status: 503,
                statusText: "Service Unavailable",
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            });
    
            (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
            mockHttpAdapter.get.mockRejectedValue(axiosError);
                
            await expect(bookDatasourceImpl.findOrCreateByApiId(apiBookId))
                .rejects.toThrow(ERROR_MESSAGES.BOOK.GET_BOOK_BY_ID.NOT_FOUND);
        });
        test('should throw CustomError when external API returns other errors', async() => {
            const apiBookId = 'invalidId';
            const axiosError = new AxiosError("Service unavailable", "500", {} as InternalAxiosRequestConfig, null, {
                data: { error: { code: 500 } },
                status: 500,
                statusText: "Service Unavailable",
                headers: {},
                config: {} as InternalAxiosRequestConfig,
            });
    
            (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
            mockHttpAdapter.get.mockRejectedValue(axiosError);
                
            await expect(bookDatasourceImpl.findOrCreateByApiId(apiBookId)).rejects.toThrow(
                CustomError.internalServer(ERROR_MESSAGES.EXTERNAL_BOOKS_API.INTERNAL)
            );
        });
    });
    
    describe('Error handling for prisma calls', () => {
        test('should throw an error when prisma.book.findFirst rejects', async () => {
            const apiBookId = '123';

            (prisma.book.findFirst as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

            await expect(bookDatasourceImpl.findOrCreateByApiId(apiBookId)).rejects.toThrow("DB connection failed");

            expect(prisma.book.findFirst).toHaveBeenCalled();
            expect(mockHttpAdapter.get).not.toHaveBeenCalled();
            expect(prisma.book.create).not.toHaveBeenCalled();
        });
        test('should throw an error when prisma.book.findUnique rejects', async () => {
            const apiBookId = '123';
            const mockBookFromApi = searchAPIResponseObj.items[0];

            (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
            mockHttpAdapter.get.mockResolvedValue(mockBookFromApi);
            (prisma.book.findUnique as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

            await expect(bookDatasourceImpl.findOrCreateByApiId(apiBookId)).rejects.toThrow("DB connection failed");
            expect(prisma.book.findFirst).toHaveBeenCalled();
            expect(mockHttpAdapter.get).toHaveBeenCalled();
            expect(prisma.book.findUnique).toHaveBeenCalled();
            expect(prisma.book.create).not.toHaveBeenCalled();
        });
        test('should throw an error when prisma.book.create rejects', async () => {
            const apiBookId = '123';
            const mockBookFromApi = searchAPIResponseObj.items[0];

            (prisma.book.findFirst as jest.Mock).mockResolvedValue(null);
            mockHttpAdapter.get.mockResolvedValue(mockBookFromApi);
            (prisma.book.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.book.create as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

            await expect(bookDatasourceImpl.findOrCreateByApiId(apiBookId)).rejects.toThrow("DB connection failed");
            expect(prisma.book.findFirst).toHaveBeenCalled();
            expect(mockHttpAdapter.get).toHaveBeenCalled();
            expect(prisma.book.findUnique).toHaveBeenCalled();
            expect(prisma.book.create).toHaveBeenCalled();
        });
    });
});
