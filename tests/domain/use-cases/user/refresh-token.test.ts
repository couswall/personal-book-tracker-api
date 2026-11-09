import {JwtAdapter} from '@config/jwt.adapter';
import {UserRepository} from '@domain/repositories/user.repository';
import {RefreshToken} from '@domain/use-cases';
import {UserEntity} from '@domain/entities/user.entity';
import {CustomError} from '@domain/errors/custom.error';
import {ERROR_MESSAGES} from '@infrastructure/constants';
import {userEntity} from '@tests/fixtures';

jest.mock('@config/jwt.adapter', () => ({
    JwtAdapter: {
        validateRefreshToken: jest.fn(),
        generateToken: jest.fn(),
        generateRefreshToken: jest.fn(),
    },
}));

describe('refresh-token use case test', () => {
    const mockUserRepository: jest.Mocked<UserRepository> = {
        create: jest.fn(),
        login: jest.fn(),
        getById: jest.fn(),
    };

    const mockToken = 'valid-token';
    const mockNewToken = 'new-token';
    const mockNewRefreshToken = 'new-refresh-token';
    const mockPayload = {
        id: userEntity.id,
        username: userEntity.username,
        email: userEntity.email,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('execute() should return a UserEntity and new token when token is valid', async () => {
        jest.mocked(JwtAdapter.validateRefreshToken).mockResolvedValue(mockPayload);
        mockUserRepository.getById.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateToken).mockResolvedValue(mockNewToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(
            mockNewRefreshToken
        );

        const result = await new RefreshToken(mockUserRepository).execute(mockToken);

        expect(result.user).toBeInstanceOf(UserEntity);
        expect(result.token).toBe(mockNewToken);
        expect(result.refreshToken).toBe(mockNewRefreshToken);
        expect(JwtAdapter.validateRefreshToken).toHaveBeenCalledWith(mockToken);
        expect(mockUserRepository.getById).toHaveBeenCalled();
        expect(JwtAdapter.generateToken).toHaveBeenCalledWith({id: userEntity.id});
        expect(JwtAdapter.generateRefreshToken).toHaveBeenCalledWith({id: userEntity.id});
    });

    test('execute() should throw error when token validation fails', async () => {
        const tokenError = CustomError.unauthorized(ERROR_MESSAGES.TOKEN.INVALID);
        jest.mocked(JwtAdapter.validateRefreshToken).mockRejectedValue(tokenError);

        await expect(
            new RefreshToken(mockUserRepository).execute(mockToken)
        ).rejects.toThrow(tokenError);
        expect(mockUserRepository.getById).not.toHaveBeenCalled();
        expect(JwtAdapter.generateToken).not.toHaveBeenCalled();
        expect(JwtAdapter.generateRefreshToken).not.toHaveBeenCalled();
    });

    test('execute() should throw error when user is not found', async () => {
        const userNotFoundError = CustomError.badRequest(
            ERROR_MESSAGES.USER.GET_BY_ID.NO_EXISTING
        );
        jest.mocked(JwtAdapter.validateRefreshToken).mockResolvedValue(mockPayload);
        mockUserRepository.getById.mockRejectedValue(userNotFoundError);

        await expect(
            new RefreshToken(mockUserRepository).execute(mockToken)
        ).rejects.toThrow(userNotFoundError);
        expect(JwtAdapter.generateToken).not.toHaveBeenCalled();
        expect(JwtAdapter.generateRefreshToken).not.toHaveBeenCalled();
    });

    test('execute() should throw a 500 error when new token generation fails', async () => {
        jest.mocked(JwtAdapter.validateRefreshToken).mockResolvedValue(mockPayload);
        mockUserRepository.getById.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateToken).mockResolvedValue(undefined);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(
            mockNewRefreshToken
        );

        await expect(
            new RefreshToken(mockUserRepository).execute(mockToken)
        ).rejects.toThrow(new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING));
    });

    test('execute() should throw a 500 error when refresh token fails', async () => {
        jest.mocked(JwtAdapter.validateRefreshToken).mockResolvedValue(mockPayload);
        mockUserRepository.getById.mockResolvedValue(userEntity);
        jest.mocked(JwtAdapter.generateToken).mockResolvedValue(mockToken);
        jest.mocked(JwtAdapter.generateRefreshToken).mockResolvedValue(undefined);

        await expect(
            new RefreshToken(mockUserRepository).execute(mockToken)
        ).rejects.toThrow(new CustomError(500, ERROR_MESSAGES.TOKEN.CREATING));
    });
});
