import {JwtAdapter} from '@config/jwt.adapter';
import {LoginUserDto} from '@domain/dtos';
import {UserRepository} from '@domain/repositories/user.repository';
import {LoginUser} from '@domain/use-cases';
import {UserEntity} from '@domain/entities/user.entity';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {loginUserDtoObj, userEntity} from '@tests/fixtures';

jest.mock('@config/jwt.adapter', () => ({
    JwtAdapter: {
        generateAccessToken: jest.fn(),
        generateRefreshToken: jest.fn(),
    },
}));

describe('login-user use case test', () => {
    const mockUserRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };
    const mockToken = 'any-token';
    const mockRefreshToken = 'any-refresh-token';
    const dto = new LoginUserDto(
        loginUserDtoObj.emailOrUsername,
        loginUserDtoObj.password
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return an UserEntity and token', async () => {
        mockUserRepository.login.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateAccessToken).mockResolvedValue(mockToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(mockRefreshToken);

        const {user, accessToken, refreshToken} = await new LoginUser(
            mockUserRepository
        ).execute(dto);

        expect(user).toBeInstanceOf(UserEntity);
        expect(accessToken).toBe(mockToken);
        expect(refreshToken).toBe(mockRefreshToken);
        expect(JwtAdapter.generateAccessToken).toHaveBeenCalledWith({id: userEntity.id});
        expect(JwtAdapter.generateRefreshToken).toHaveBeenCalledWith({id: userEntity.id});
    });

    test('execute() should throw a 500 error status when token is undefined', async () => {
        mockUserRepository.login.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateAccessToken).mockResolvedValue(undefined);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(mockRefreshToken);

        await expect(new LoginUser(mockUserRepository).execute(dto)).rejects.toThrow(
            new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING)
        );
    });

    test('execute() should throw a 500 error status when refresh token is undefined', async () => {
        mockUserRepository.login.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateAccessToken).mockResolvedValue(mockToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(undefined);

        await expect(new LoginUser(mockUserRepository).execute(dto)).rejects.toThrow(
            new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING)
        );
    });
});
