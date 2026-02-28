import {UserRepository} from '@domain/repositories/user.repository';
import {BookshelfRepository} from '@domain/repositories/bookshelf.repository';
import {CreateCustom} from '@domain/use-cases';
import {CreateCustomBookShelfDto} from '@domain/dtos';
import {BookshelfEntity} from '@domain/entities';
import {CustomError} from '@domain/errors/custom.error';
import {bookshelfEntity, createCustomBookshelfDto, userEntity} from '@tests/fixtures';
import {ERROR_MESSAGES} from '@infrastructure/constants';

describe('createCustom-bookshelf use case test', () => {
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

    test('execute() should return a BookshelfEntity', async () => {
        const [, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

        mockUserRepository.getById.mockResolvedValue(userEntity);
        mockBookshelfRepository.createCustom.mockResolvedValue(bookshelfEntity);

        const result = await new CreateCustom(
            mockBookshelfRepository,
            mockUserRepository
        ).execute(dto!);

        expect(result).toBeInstanceOf(BookshelfEntity);
        expect(mockUserRepository.getById).toHaveBeenCalledWith({
            id: createCustomBookshelfDto.userId,
        });
    });

    test('should throw a 400 error status when user with provided ID does not exist', async () => {
        const [, dto] = CreateCustomBookShelfDto.create(createCustomBookshelfDto);

        mockUserRepository.getById.mockRejectedValue(
            CustomError.badRequest(ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING)
        );
        mockBookshelfRepository.createCustom.mockResolvedValue(bookshelfEntity);

        await expect(
            new CreateCustom(mockBookshelfRepository, mockUserRepository).execute(dto!)
        ).rejects.toThrow(
            CustomError.badRequest(ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING)
        );
    });
});
