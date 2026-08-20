import {prisma} from '@data/postgres';
import {BookshelfEntity} from '@domain/entities';
import {BookshelfDatasourceImpl} from '@infrastructure/datasources/bookshelf.datasource.impl';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {readBookshelfPrisma} from '@tests/fixtures';

jest.mock('@data/postgres', () => ({
    prisma: {
        bookshelf: {
            findFirst: jest.fn(),
        },
    },
}));

describe('BookshelfDatasourceImpl.getBookshelfByUserAndType', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const bookshelfDatasourceImpl = new BookshelfDatasourceImpl();

    test('should return a BookshelfEntity when getting successfully', async () => {
        (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(readBookshelfPrisma);

        const result = await bookshelfDatasourceImpl.getBookshelfByUserAndType(
            readBookshelfPrisma.userId,
            readBookshelfPrisma.type
        );

        expect(result).toBeInstanceOf(BookshelfEntity);
        expect(prisma.bookshelf.findFirst).toHaveBeenCalledWith({
            where: {
                userId: readBookshelfPrisma.userId,
                type: readBookshelfPrisma.type,
                deletedAt: null,
            },
        });
    });

    test('should throw a 400 error if no bookshelf of that type exists for the user', async () => {
        (prisma.bookshelf.findFirst as jest.Mock).mockResolvedValue(null);

        await expect(
            bookshelfDatasourceImpl.getBookshelfByUserAndType(
                readBookshelfPrisma.userId,
                readBookshelfPrisma.type
            )
        ).rejects.toThrow(
            ERROR_MESSAGES.BOOKSHELF.GET_BOOKSHELF_BY_USER_AND_TYPE.NOT_FOUND
        );
    });
});
