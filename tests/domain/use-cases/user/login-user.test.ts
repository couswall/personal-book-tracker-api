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
        generateToken: jest.fn(),
    },
}));

describe('login-user use case test', () => {
    const mockUserRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return an UserEntity and token', async () => {
        const [, dto] = LoginUserDto.create(loginUserDtoObj);
        const mockToken = 'any-token';

        mockUserRepository.login.mockResolvedValue(userEntity);
        (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(mockToken);

        const {user, token} = await new LoginUser(mockUserRepository).execute(dto!);

        expect(user).toBeInstanceOf(UserEntity);
        expect(token).toBe(mockToken);
        expect(JwtAdapter.generateToken).toHaveBeenCalledWith({
            id: userEntity.id,
            username: userEntity.username,
            email: userEntity.email,
        });
    });

    test('execute() should throw a 500 error status when token is undefined', async () => {
        const [, dto] = LoginUserDto.create(loginUserDtoObj);

        mockUserRepository.login.mockResolvedValue(userEntity);
        (JwtAdapter.generateToken as jest.Mock).mockResolvedValue(undefined);

        await expect(new LoginUser(mockUserRepository).execute(dto!)).rejects.toThrow(
            new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING)
        );
    });
});
