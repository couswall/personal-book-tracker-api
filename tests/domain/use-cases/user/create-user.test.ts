import {JwtAdapter} from '@config/jwt.adapter';
import {BCryptAdapter} from '@config/bcrypt.adapter';
import {CreateUserDto} from '@domain/dtos';
import {UserRepository} from '@domain/repositories/user.repository';
import {CreateUser} from '@domain/use-cases';
import {UserEntity} from '@domain/entities/user.entity';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {createUserDtoObj, userEntity} from '@tests/fixtures';

jest.mock('@config/bcrypt.adapter', () => ({
    BCryptAdapter: {
        hash: jest.fn(),
    },
}));

jest.mock('@config/jwt.adapter', () => ({
    JwtAdapter: {
        generateToken: jest.fn(),
    },
}));

describe('create-user use case test', () => {
    const mockUserRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return an UserEntity instance and token', async () => {
        const [, dto] = CreateUserDto.create(createUserDtoObj);
        const hashPassoword = 'hashedPassword';
        const mockToken = 'any-token';

        (BCryptAdapter.hash as jest.Mock).mockReturnValue(hashPassoword);
        mockUserRepository.create.mockResolvedValue(userEntity);
        (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(mockToken);

        const result = await new CreateUser(mockUserRepository).execute(dto!);

        expect(result.user).toBeInstanceOf(UserEntity);
        expect(result.token).toBe(mockToken);
        expect(BCryptAdapter.hash).toHaveBeenCalledWith(dto!.password);
        expect(JwtAdapter.generateToken).toHaveBeenCalledWith({
            id: userEntity.id,
            username: userEntity.username,
            email: userEntity.email,
        });
    });

    test('execute() should throw a 500 error status when token is undefined', async () => {
        const [, dto] = CreateUserDto.create(createUserDtoObj);

        mockUserRepository.create.mockResolvedValue(userEntity);
        (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(undefined);

        await expect(new CreateUser(mockUserRepository).execute(dto!)).rejects.toThrow(
            new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING)
        );
    });
});
