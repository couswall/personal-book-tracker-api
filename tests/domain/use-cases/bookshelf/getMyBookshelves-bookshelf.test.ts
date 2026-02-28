import {UserRepository} from '@domain/repositories/user.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {GetMyBookShelves} from '@domain/use-cases';
import {BookshelfEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {bookshelfEntity, userEntity, userObj} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('getMyBookshelves-bookshelf use case tests', () => {
    const mockBookshelfRepository: jest.Mocked<BookshelfRepository> = {
        createCustom: jest.fn(),
        getMyBookshelves: jest.fn(),
        getBookshelfById: jest.fn(),
    };
    const mockUserRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return an array of BookshelfEntity', async () => {
        mockUserRepository.getById.mockResolvedValue(userEntity);
        mockBookshelfRepository.getMyBookshelves.mockResolvedValue([bookshelfEntity]);

        const result = await new GetMyBookShelves(
            mockBookshelfRepository,
            mockUserRepository
        ).execute(userObj.id);

        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toBeInstanceOf(BookshelfEntity);
        expect(mockUserRepository.getById).toHaveBeenCalledWith({id: userObj.id});
    });

    test('execute() should throw an error when user with provided ID does not exist', async () => {
        mockUserRepository.getById.mockRejectedValue(
            CustomError.badRequest(ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING)
        );

        await expect(
            new GetMyBookShelves(mockBookshelfRepository, mockUserRepository).execute(
                userObj.id
            )
        ).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING)
        );
    });
});
