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
        generateAccessToken: jest.fn(),
        generateRefreshToken: jest.fn(),
    },
}));

describe('create-user use case test', () => {
    const mockUserRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };

    const mockToken = 'any-token';
    const mockRefreshToken = 'any-refresh-token';
    const dto = new CreateUserDto(
        createUserDtoObj.fullName,
        createUserDtoObj.username,
        createUserDtoObj.email,
        createUserDtoObj.password
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return an UserEntity instance and token', async () => {
        const hashPassoword = 'hashedPassword';

        jest.mocked(BCryptAdapter.hash).mockReturnValue(hashPassoword);
        mockUserRepository.create.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateAccessToken).mockResolvedValue(mockToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(mockRefreshToken);

        const result = await new CreateUser(mockUserRepository).execute(dto);

        expect(result.user).toBeInstanceOf(UserEntity);
        expect(result.accessToken).toBe(mockToken);
        expect(BCryptAdapter.hash).toHaveBeenCalledWith(dto.password);
        expect(JwtAdapter.generateAccessToken).toHaveBeenCalledWith({id: userEntity.id});
        expect(JwtAdapter.generateRefreshToken).toHaveBeenCalledWith({id: userEntity.id});
    });

    test('execute() should throw a 500 error status when token is undefined', async () => {
        mockUserRepository.create.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateAccessToken).mockResolvedValue(undefined);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(mockRefreshToken);

        await expect(new CreateUser(mockUserRepository).execute(dto)).rejects.toThrow(
            new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING)
        );
    });

    test('execute() should throw a 500 error status when refresh token is undefined', async () => {
        mockUserRepository.create.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateAccessToken).mockResolvedValue(mockToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(undefined);

        await expect(new CreateUser(mockUserRepository).execute(dto)).rejects.toThrow(
            new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING)
        );
    });
});
