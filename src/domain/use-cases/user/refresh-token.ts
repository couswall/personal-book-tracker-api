import {JwtAdapter} from '@src/config';
import {GetUserByIdDto} from '@domain/dtos';
import {UserRepository} from '@domain/repositories/user.repository';
import {CustomError} from '@domain/errors/custom.error';
import {
    RefreshTokenResponse,
    RefreshTokenUseCase,
} from '@domain/use-cases/interfaces/user.interfaces';
import {ERROR_MESSAGES} from '@infrastructure/constants';

export class RefreshToken implements RefreshTokenUseCase {
    constructor(private readonly repository: UserRepository) {}

    async execute(refreshToken: string): Promise<RefreshTokenResponse> {
        const payload = await JwtAdapter.validateRefreshToken(refreshToken);

        const [error, getUserByIdDto] = GetUserByIdDto.create(payload.id);
        if (error) throw CustomError.badRequest(error);
        if (!getUserByIdDto)
            throw CustomError.internalServer(ERROR_MESSAGES.TOKEN.CREATING);

        const user = await this.repository.getById(getUserByIdDto);

        const [newToken, newRefreshToken] = await Promise.all([
            JwtAdapter.generateToken({id: user.id}),
            JwtAdapter.generateRefreshToken({id: user.id}),
        ]);

        if (!newToken || !newRefreshToken)
            throw CustomError.internalServer(ERROR_MESSAGES.TOKEN.CREATING);

        return {user, token: newToken, refreshToken: newRefreshToken};
    }
}
