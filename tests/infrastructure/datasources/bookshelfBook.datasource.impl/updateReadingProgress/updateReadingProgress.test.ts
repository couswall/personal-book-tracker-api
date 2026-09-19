import {prisma} from '@tests/setup';
import {UpdateReadingProgressDto} from '@domain/dtos';
import {BookshelfBookDatasourceImpl} from '@infrastructure/datasources/bookshelfBook/bookshelfBook.datasource.impl';
import {BookshelfBookEntity} from '@domain/entities';
import {bookshelfBookPrisma, updateReadingProgressDtoObject} from '@tests/fixtures';

describe('BookshelfBookDatasourceImpl.updateReadingProgress tests', () => {
    const datasourceImpl = new BookshelfBookDatasourceImpl();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should derive currentPage and readingProgress from a PAGE value within range', async () => {
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PAGE',
            value: 150,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue({
            ...bookshelfBookPrisma,
            currentPage: 150,
            readingProgress: 50,
        });

        const result = await datasourceImpl.updateReadingProgress(dto);

        expect(result).toBeInstanceOf(BookshelfBookEntity);
        expect(prisma.bookshelfBook.findUnique).toHaveBeenCalledWith({
            where: {id: dto.bookshelfBookId},
        });
        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {currentPage: 150, readingProgress: 50, progressType: 'PAGE'},
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should clamp a PAGE value above totalPages', async () => {
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PAGE',
            value: 9000,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.updateReadingProgress(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                currentPage: bookshelfBookPrisma.totalPages,
                readingProgress: 100,
                progressType: 'PAGE',
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should clamp a PAGE value below 0', async () => {
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PAGE',
            value: -10,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.updateReadingProgress(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {currentPage: 0, readingProgress: 0, progressType: 'PAGE'},
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should keep the existing readingProgress for a PAGE update when totalPages is null', async () => {
        const existingBook = {...bookshelfBookPrisma, totalPages: null};
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PAGE',
            value: 150,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            existingBook
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(existingBook);

        await datasourceImpl.updateReadingProgress(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                currentPage: 150,
                readingProgress: existingBook.readingProgress,
                progressType: 'PAGE',
            },
            where: {id: existingBook.id},
        });
    });

    test('should derive currentPage and readingProgress from a PERCENTAGE value within range', async () => {
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PERCENTAGE',
            value: 60,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.updateReadingProgress(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {currentPage: 180, readingProgress: 60, progressType: 'PERCENTAGE'},
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should clamp a PERCENTAGE value above 100', async () => {
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PERCENTAGE',
            value: 150,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.updateReadingProgress(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                currentPage: bookshelfBookPrisma.totalPages,
                readingProgress: 100,
                progressType: 'PERCENTAGE',
            },
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should clamp a PERCENTAGE value below 0', async () => {
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PERCENTAGE',
            value: -20,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            bookshelfBookPrisma
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(bookshelfBookPrisma);

        await datasourceImpl.updateReadingProgress(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {currentPage: 0, readingProgress: 0, progressType: 'PERCENTAGE'},
            where: {id: bookshelfBookPrisma.id},
        });
    });

    test('should keep the existing currentPage for a PERCENTAGE update when totalPages is null', async () => {
        const existingBook = {...bookshelfBookPrisma, totalPages: null};
        const [, dto] = UpdateReadingProgressDto.create({
            ...updateReadingProgressDtoObject,
            progressType: 'PERCENTAGE',
            value: 60,
        });
        if (!dto) throw new Error();

        (prisma.bookshelfBook.findUnique as jest.Mock).mockResolvedValueOnce(
            existingBook
        );
        (prisma.bookshelfBook.update as jest.Mock).mockResolvedValue(existingBook);

        await datasourceImpl.updateReadingProgress(dto);

        expect(prisma.bookshelfBook.update).toHaveBeenCalledWith({
            data: {
                currentPage: existingBook.currentPage,
                readingProgress: 60,
                progressType: 'PERCENTAGE',
            },
            where: {id: existingBook.id},
        });
    });
});
