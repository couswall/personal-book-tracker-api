import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {UserRepository} from '@domain/repositories/user.repository';
import {GetBookshelvesWithStatus} from '@domain/use-cases';
import {GetBookshelvesWithStatusDto} from '@domain/dtos';
import {CustomError} from '@domain/errors/custom.error';
import {bookshelfWithStatus, userEntity, userObj} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('getBookshelvesWithStatus use case tests', () => {
    const mockBookshelfRepository: jest.Mocked<BookshelfRepository> = {
        createCustom: jest.fn(),
        getMyBookshelves: jest.fn(),
        getBookshelfById: jest.fn(),
        getBookshelvesWithStatus: jest.fn(),
    };
    const mockUserRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };

    const [, dtoResult] = GetBookshelvesWithStatusDto.create({
        userId: userObj.id,
        apiBookId: 'abc123',
    });
    const dto = dtoResult as GetBookshelvesWithStatusDto;

    beforeEach(() => jest.clearAllMocks());

    test('execute() should return an array of IBookshelfWithStatus', async () => {
        mockUserRepository.getById.mockResolvedValue(userEntity);
        mockBookshelfRepository.getBookshelvesWithStatus.mockResolvedValue([
            bookshelfWithStatus,
        ]);

        const result = await new GetBookshelvesWithStatus(
            mockBookshelfRepository,
            mockUserRepository
        ).execute(dto);

        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toEqual(bookshelfWithStatus);
        expect(mockUserRepository.getById).toHaveBeenCalledWith({id: dto.userId});
        expect(mockBookshelfRepository.getBookshelvesWithStatus).toHaveBeenCalledWith(
            dto.userId,
            dto.apiBookId
        );
    });

    test('execute() should throw an error when user does not exist', async () => {
        mockUserRepository.getById.mockRejectedValue(
            CustomError.badRequest(ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING)
        );

        await expect(
            new GetBookshelvesWithStatus(
                mockBookshelfRepository,
                mockUserRepository
            ).execute(dto)
        ).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING)
        );

        expect(mockBookshelfRepository.getBookshelvesWithStatus).not.toHaveBeenCalled();
    });
});
